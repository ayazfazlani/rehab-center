<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('manage-invoices');

        $branchId = $request->user()->current_branch_id;
        $invoices = Invoice::with('patient')
            ->where('branch_id', $branchId)
            ->latest()
            ->paginate(10);

        return \Inertia\Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
            'patients' => \App\Models\Patient::where('branch_id', $branchId)->get(['id', 'first_name', 'last_name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'description' => 'nullable|string',
            'total_amount' => 'required|numeric|min:0',
            'type' => 'required|in:once,installment',
            'due_date' => 'nullable|date',
            'invoice_date' => 'nullable|date',
            'initial_payment' => 'nullable|numeric|min:0|max:' . $request->total_amount,
            'installment_count' => 'required_if:type,installment|integer|min:1|max:24',
        ]);

        $invoice = Invoice::create([
            'tenant_id' => $request->user()->tenant_id,
            'branch_id' => $request->user()->current_branch_id,
            'patient_id' => $validated['patient_id'],
            'invoice_number' => 'INV-' . strtoupper(uniqid()),
            'description' => $validated['description'],
            'total_amount' => $validated['total_amount'],
            'balance_due' => $validated['total_amount'],
            'type' => $validated['type'],
            'due_date' => $validated['due_date'],
            'invoice_date' => $validated['invoice_date'] ?? now(),
            'status' => 'unpaid',
        ]);

        if ($validated['type'] === 'installment') {
            $count = (int)$validated['installment_count'];
            $initial = (float)($validated['initial_payment'] ?? 0);
            $remaining = $validated['total_amount'] - $initial;
            
            // Create first installment (Advance)
            if ($initial > 0) {
                $invoice->installments()->create([
                    'tenant_id' => $request->user()->tenant_id,
                    'amount' => $initial,
                    'due_date' => now(),
                    'status' => 'pending', // or 'paid' if you want it immediate
                ]);
                $count--; // One down
            }

            if ($count > 0 && $remaining > 0) {
                $amountPerInstallment = $remaining / $count;
                for ($i = 0; $i < $count; $i++) {
                    $invoice->installments()->create([
                        'tenant_id' => $request->user()->tenant_id,
                        'amount' => $amountPerInstallment,
                        'due_date' => now()->addMonths($i + 1),
                        'status' => 'pending',
                    ]);
                }
            }
        }

        return back()->with('success', 'Invoice created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        $this->authorize('manage-invoices');

        return \Inertia\Inertia::render('Invoices/Show', [
            'invoice' => $invoice->load(['patient', 'installments']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoice $invoice)
    {
        $this->authorize('manage-invoices');

        if ($invoice->type !== 'once') {
            return back()->with('error', 'Cannot directly modify total amount of installment plans.');
        }

        $validated = $request->validate([
            'total_amount' => 'required|numeric|min:0',
        ]);

        $invoice->total_amount = $validated['total_amount'];
        $invoice->save();
        $invoice->updateBalance();

        return back()->with('success', 'Invoice total updated successfully.');
    }

    public function storeInstallment(Request $request, Invoice $invoice)
    {
        $this->authorize('manage-invoices');

        if ($invoice->type !== 'installment') {
            return back()->with('error', 'Cannot add installments to a non-installment invoice.');
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'status' => 'required|in:pending,paid',
        ]);

        $invoice->installments()->create([
            'tenant_id' => $request->user()->tenant_id,
            'amount' => $validated['amount'],
            'due_date' => $validated['due_date'],
            'status' => $validated['status'],
            'paid_at' => $validated['status'] === 'paid' ? now() : null,
        ]);

        $invoice->updateBalance();

        return back()->with('success', 'Installment added successfully.');
    }

    public function updateInstallment(Request $request, Invoice $invoice, \App\Models\PaymentInstallment $installment)
    {
        $this->authorize('manage-invoices');

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'status' => 'required|in:pending,paid',
            'reference_slip' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $data = [
            'amount' => $validated['amount'],
            'due_date' => $validated['due_date'],
            'status' => $validated['status'],
            'paid_at' => $validated['status'] === 'paid' ? ($installment->paid_at ?? now()) : null,
        ];

        if ($request->hasFile('reference_slip')) {
            $path = $request->file('reference_slip')->store('slips/' . $invoice->tenant_id, 'public');
            $data['reference_slip'] = $path;
        }

        $installment->update($data);

        $invoice->updateBalance();

        return back()->with('success', 'Installment updated.');
    }

    public function destroy(Invoice $invoice)
    {
        $this->authorize('manage-invoices');
        $invoice->delete();
        return redirect()->route('invoices.index')->with('success', 'Invoice deleted.');
    }

    public function recordPayment(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'installment_id' => 'nullable|exists:payment_installments,id',
        ]);

        if ($validated['installment_id']) {
            $installment = \App\Models\PaymentInstallment::find($validated['installment_id']);
            $installment->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);
        } else {
            // General payment behavior
            $invoice->amount_paid += $validated['amount'];
        }

        $invoice->updateBalance();

        return back()->with('success', 'Payment recorded.');
    }
}
