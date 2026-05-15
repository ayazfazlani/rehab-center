<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PatientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('manage-patients');

        $branchId = $request->user()->current_branch_id;
        $patients = Patient::where('branch_id', $branchId)
            ->latest()
            ->paginate(10);

        return \Inertia\Inertia::render('Patients/Index', [
            'patients' => $patients
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $patient = Patient::create([
            ...$validated,
            'tenant_id' => $request->user()->tenant_id,
            'branch_id' => $request->user()->current_branch_id,
        ]);

        return back()->with('success', 'Patient registered successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Patient $patient)
    {
        $this->authorize('manage-patients');

        return \Inertia\Inertia::render('Patients/Show', [
            'patient' => $patient,
            'invoices' => \App\Models\Invoice::where('patient_id', $patient->id)->latest()->get(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Patient $patient)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Patient $patient)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Patient $patient)
    {
        //
    }
}
