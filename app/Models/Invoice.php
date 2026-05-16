<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Invoice extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'branch_id',
        'patient_id',
        'invoice_number',
        'description',
        'total_amount',
        'amount_paid',
        'balance_due',
        'status',
        'type',
        'due_date',
        'invoice_date',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'invoice_date' => 'date',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function installments()
    {
        return $this->hasMany(PaymentInstallment::class);
    }

    public function updateBalance()
    {
        $this->amount_paid = $this->installments()->where('status', 'paid')->sum('amount');
        
        // Ensure total_amount matches sum of all installments if it's an installment type
        if ($this->type === 'installment') {
            $this->total_amount = $this->installments()->sum('amount');
        }

        $this->balance_due = $this->total_amount - $this->amount_paid;
        
        if ($this->balance_due <= 0) {
            $this->status = 'paid';
        } elseif ($this->amount_paid > 0) {
            $this->status = 'partially_paid';
        } else {
            $this->status = 'unpaid';
        }
        
        $this->save();
    }
}
