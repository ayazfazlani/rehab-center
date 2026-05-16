<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('manage-branches');

        $branches = Branch::where('tenant_id', $request->user()->tenant_id)
            ->latest()
            ->get();

        return \Inertia\Inertia::render('Branches/Index', [
            'branches' => $branches
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $branch = Branch::create([
            ...$validated,
            'tenant_id' => $request->user()->tenant_id,
        ]);

        // Automatically assign the user to the new branch
        $request->user()->branches()->attach($branch->id, ['tenant_id' => $request->user()->tenant_id]);

        return back()->with('success', 'Branch created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Branch $branch)
    {
        $this->authorize('manage-branches');

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:20',
            'logo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('logos', 'public');
        }

        $branch->update($validated);

        return back()->with('success', 'Branch updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Branch $branch)
    {
        $this->authorize('manage-branches');
        $branch->delete();
        return back()->with('success', 'Branch deleted.');
    }
}
