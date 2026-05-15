<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: sans-serif; color: #333; }
        .header { border-bottom: 2px solid #0e91e9; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #0e91e9; }
        .branch-info { float: right; text-align: right; font-size: 12px; color: #666; }
        .invoice-title { font-size: 32px; font-weight: bold; margin-bottom: 20px; text-transform: uppercase; }
        .details-grid { width: 100%; margin-bottom: 30px; }
        .details-grid td { vertical-align: top; width: 50%; }
        .label { font-size: 10px; font-weight: bold; color: #999; text-transform: uppercase; margin-bottom: 5px; }
        .value { font-size: 14px; font-weight: bold; }
        table.items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        table.items th { background: #f0f7ff; color: #0e91e9; text-align: left; padding: 10px; font-size: 12px; }
        table.items td { padding: 15px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
        .summary { float: right; width: 250px; }
        .summary-row { padding: 5px 0; border-bottom: 1px solid #eee; }
        .summary-row.total { border-bottom: none; color: #0e91e9; font-size: 18px; font-weight: bold; padding-top: 10px; }
        .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .badge-paid { background: #e0fdf4; color: #10b981; }
        .badge-unpaid { background: #fffbeb; color: #f59e0b; }
    </style>
</head>
<body>
    <div class="header">
        <div class="branch-info">
            <strong>{{ $invoice->branch->name }}</strong><br>
            {{ $invoice->branch->location }}<br>
            {{ $invoice->branch->contact_phone }}
        </div>
        <div class="logo">REHAB CENTER</div>
    </div>

    <div class="invoice-title">Invoice</div>

    <table class="details-grid">
        <tr>
            <td>
                <div class="label">Billed To</div>
                <div class="value">{{ $invoice->patient->first_name }} {{ $invoice->patient->last_name }}</div>
                <div style="font-size: 12px; color: #666;">{{ $invoice->patient->email }}</div>
            </td>
            <td style="text-align: right;">
                <div class="label">Invoice Number</div>
                <div class="value">#{{ $invoice->invoice_number }}</div>
                <div class="label" style="margin-top: 10px;">Date Issued</div>
                <div class="value">{{ $invoice->created_at->format('M d, Y') }}</div>
            </td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th>Description</th>
                <th>Type</th>
                <th style="text-align: right;">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $invoice->description ?: 'Hospital Services / Rehabilitation' }}</td>
                <td style="text-transform: capitalize;">{{ $invoice->type }}</td>
                <td style="text-align: right; font-weight: bold;">${{ number_format($invoice->total_amount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-row">
            <span style="color: #999;">Subtotal:</span>
            <span style="float: right;">${{ number_format($invoice->total_amount, 2) }}</span>
        </div>
        <div class="summary-row">
            <span style="color: #999;">Amount Paid:</span>
            <span style="float: right;">${{ number_format($invoice->amount_paid, 2) }}</span>
        </div>
        <div class="summary-row total">
            <span>Total Balance:</span>
            <span style="float: right;">${{ number_format($invoice->balance_due, 2) }}</span>
        </div>
        
        <div style="margin-top: 20px; text-align: right;">
            <span class="badge {{ $invoice->status === 'paid' ? 'badge-paid' : 'badge-unpaid' }}">
                {{ $invoice->status }}
            </span>
        </div>
    </div>

    @if($invoice->type === 'installment' && $invoice->installments->count() > 0)
        <div style="margin-top: 50px;">
            <div class="label">Payment Schedule</div>
            <table class="items" style="margin-top: 10px;">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Installment</th>
                        <th style="text-align: right;">Amount</th>
                        <th style="text-align: right;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($invoice->installments as $i => $installment)
                        <tr>
                            <td>{{ $installment->due_date->format('M d, Y') }}</td>
                            <td>Installment #{{ $i + 1 }}</td>
                            <td style="text-align: right;">${{ number_format($installment->amount, 2) }}</td>
                            <td style="text-align: right;">
                                <span style="font-size: 10px; color: {{ $installment->status === 'paid' ? '#10b981' : '#f59e0b' }};">
                                    {{ strtoupper($installment->status) }}
                                </span>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    <div class="footer">
        Thank you for choosing Rehab Center. This is a computer-generated document.
    </div>
</body>
</html>
