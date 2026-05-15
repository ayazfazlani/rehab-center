<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class PaymentInstallment extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'invoice_id',
        'amount',
        'due_date',
        'paid_at',
        'status',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
