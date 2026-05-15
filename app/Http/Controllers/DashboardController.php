<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Invoice;
use App\Models\Patient;
use App\Models\Expense;
use App\Models\Branch;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $branchId = $user->current_branch_id;

        // If no branch selected, get the first one available
        if (!$branchId && $user->branches()->exists()) {
            $branchId = $user->branches()->first()->id;
            $user->update(['current_branch_id' => $branchId]);
        }

        $stats = [
            'total_patients' => Patient::where('branch_id', $branchId)->count(),
            'pending_invoices' => Invoice::where('branch_id', $branchId)->where('status', '!=', 'paid')->count(),
            'revenue_this_month' => Invoice::where('branch_id', $branchId)
                ->whereMonth('created_at', now()->month)
                ->sum('amount_paid'),
            'expenses_this_month' => Expense::where('branch_id', $branchId)
                ->whereMonth('date', now()->month)
                ->sum('amount'),
        ];

        $recentInvoices = Invoice::with('patient')
            ->where('branch_id', $branchId)
            ->latest()
            ->take(5)
            ->get();

        $branches = $user->branches;

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentInvoices' => $recentInvoices,
            'branches' => $branches,
            'currentBranchId' => $branchId,
        ]);
    }
}
