<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Wallet extends Model
{
    protected $fillable = [
        'client_id',
        'balance',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
