<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('manage-expenses');

        $branchId = $request->user()->current_branch_id;
        $expenses = Expense::where('branch_id', $branchId)
            ->latest()
            ->paginate(15);

        return \Inertia\Inertia::render('Expenses/Index', [
            'expenses' => $expenses
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        Expense::create([
            ...$validated,
            'tenant_id' => $request->user()->tenant_id,
            'branch_id' => $request->user()->current_branch_id,
        ]);

        return back()->with('success', 'Expense logged.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Expense $expense)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Expense $expense)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Expense $expense)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Expense $expense)
    {
        //
    }
}
