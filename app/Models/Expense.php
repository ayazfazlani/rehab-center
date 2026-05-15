<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Expense extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'branch_id',
        'category',
        'amount',
        'date',
        'description',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
