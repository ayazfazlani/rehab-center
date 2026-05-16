<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Branch extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'name',
        'location',
        'contact_email',
        'contact_phone',
        'logo',
        'branding_logo',
        'branding_colors',
    ];

    protected $casts = [
        'branding_colors' => 'json',
    ];

    public function patients()
    {
        return $this->hasMany(Patient::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
