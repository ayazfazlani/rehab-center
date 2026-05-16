<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: sans-serif;
            color: #333;
        }

        .header {
            border-bottom: 2px solid #0e91e9;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #0e91e9;
        }

        .branch-info {
            float: right;
            text-align: right;
            font-size: 12px;
            color: #666;
        }

        .invoice-title {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 20px;
            text-transform: uppercase;
        }

        .details-grid {
            width: 100%;
            margin-bottom: 30px;
        }

        .details-grid td {
            vertical-align: top;
            width: 50%;
        }

        .label {
            font-size: 10px;
            font-weight: bold;
            color: #999;
            text-transform: uppercase;
            margin-bottom: 5px;
        }

        .value {
            font-size: 14px;
            font-weight: bold;
        }

        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        table.items th {
            background: #f0f7ff;
            color: #0e91e9;
            text-align: left;
            padding: 10px;
            font-size: 12px;
        }

        table.items td {
            padding: 15px 10px;
            border-bottom: 1px solid #eee;
            font-size: 13px;
        }

        .footer {
            position: fixed;
            bottom: -20px;
            width: 100%;
            text-align: center;
            font-size: 9px;
            color: #aaa;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }

        .branding {
            font-weight: bold;
            color: #0e91e9;
        }

        .summary {
            float: right;
            width: 250px;
        }

        .summary-row {
            padding: 5px 0;
            border-bottom: 1px solid #eee;
        }

        .summary-row.total {
            border-bottom: none;
            color: #0e91e9;
            font-size: 18px;
            font-weight: bold;
            padding-top: 10px;
        }

        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .badge-paid {
            background: #e0fdf4;
            color: #10b981;
        }

        .badge-unpaid {
            background: #fffbeb;
            color: #f59e0b;
        }
    </style>
</head>

<body>
    <div class="header">
        <div class="branch-info">
            <strong>{{ $invoice->branch->name }}</strong><br>
            {{ $invoice->branch->location }}<br>
            {{ $invoice->branch->contact_phone }}
        </div>
        @if($invoice->branch->logo)
            <img src="{{ public_path('storage/' . $invoice->branch->logo) }}"
                style="height: 60px; max-width: 200px; object-fit: contain;">
        @else
            <div class="logo">REHAB CENTER</div>
        @endif
    </div>

    <div class="invoice-title">Installment Invoice</div>

    <table class="details-grid">
        <tr>
            <td>
                <div class="label">Billed To</div>
                <div class="value">{{ $invoice->patient->first_name }} {{ $invoice->patient->last_name }}</div>
                <div style="font-size: 12px; color: #666;">{{ $invoice->patient->email }}</div>
            </td>
            <td style="text-align: right;">
                <div class="label">Installment Ref</div>
                <div class="value">#INV-{{ $invoice->invoice_number }}-{{ $installment->id }}</div>
                <div class="label" style="margin-top: 10px;">Scheduled Date</div>
                <div class="value">{{ $installment->due_date->format('M d, Y') }}</div>
            </td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th>Description</th>
                <th style="text-align: right;">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $invoice->description ?: 'Hospital Services / Rehabilitation' }} - Installment Payment</td>
                <td style="text-align: right; font-weight: bold;">${{ number_format($installment->amount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-row total">
            <span>Amount Due:</span>
            <span style="float: right;">${{ number_format($installment->amount, 2) }}</span>
        </div>

        <div style="margin-top: 20px; text-align: right;">
            <span class="badge {{ $installment->status === 'paid' ? 'badge-paid' : 'badge-unpaid' }}">
                {{ $installment->status }}
            </span>
        </div>
    </div>

    <div class="footer">
        This document was generated for <strong>{{ $invoice->branch->name }}</strong>.
        All rights reserved. | <span class="branding">Developed by masofts.com</span>
    </div>
</body>

</html>