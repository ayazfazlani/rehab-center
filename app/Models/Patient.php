<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Patient extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'branch_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'medical_history',
    ];

    protected $casts = [
        'medical_history' => 'json',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
