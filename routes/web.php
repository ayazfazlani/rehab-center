<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

use App\Http\Controllers\DashboardController;

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

use Illuminate\Http\Request;

Route::middleware('auth')->group(function () {
    Route::post('/branches/switch', function (Request $request) {
        $request->validate(['branch_id' => 'required|exists:branches,id']);
        $request->user()->update(['current_branch_id' => $request->branch_id]);
        return back();
    })->name('branches.switch');

    Route::resource('branches', \App\Http\Controllers\BranchController::class);
    Route::resource('patients', \App\Http\Controllers\PatientController::class);
    Route::resource('invoices', \App\Http\Controllers\InvoiceController::class);
    Route::resource('expenses', \App\Http\Controllers\ExpenseController::class);
    Route::resource('users', \App\Http\Controllers\UserController::class);
    Route::resource('roles', \App\Http\Controllers\RoleController::class);
    
    Route::post('invoices/{invoice}/payment', [\App\Http\Controllers\InvoiceController::class, 'recordPayment'])->name('invoices.payment');
    Route::post('invoices/{invoice}/installments', [\App\Http\Controllers\InvoiceController::class, 'storeInstallment'])->name('invoices.installments.store');
    Route::post('invoices/{invoice}/installments/{installment}', [\App\Http\Controllers\InvoiceController::class, 'updateInstallment'])->name('invoices.installments.update');
    Route::get('invoices/{invoice}/installments/{installment}/pdf', [\App\Http\Controllers\InvoiceExportController::class, 'installmentPdf'])->name('invoices.installments.pdf');
    Route::get('invoices/{invoice}/pdf', [\App\Http\Controllers\InvoiceExportController::class, 'pdf'])->name('invoices.pdf');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
