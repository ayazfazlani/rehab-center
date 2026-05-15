<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceExportController extends Controller
{
    public function pdf(Invoice $invoice)
    {
        // Ensure user belongs to the same tenant as the invoice
        if ($invoice->tenant_id !== auth()->user()->tenant_id) {
            abort(403);
        }

        $invoice->load(['patient', 'branch', 'installments']);

        $pdf = Pdf::loadView('reports.invoice', compact('invoice'));
        
        return $pdf->stream("Invoice-{$invoice->invoice_number}.pdf");
    }

    public function installmentPdf(Invoice $invoice, \App\Models\PaymentInstallment $installment)
    {
        if ($invoice->tenant_id !== auth()->user()->tenant_id || $installment->invoice_id !== $invoice->id) {
            abort(403);
        }

        $invoice->load(['patient', 'branch']);

        $pdf = Pdf::loadView('reports.installment', compact('invoice', 'installment'));
        
        return $pdf->stream("Installment-{$invoice->invoice_number}-{$installment->id}.pdf");
    }
}
