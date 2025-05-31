<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConfirmationToken extends Model
{
    protected $fillable = [
        'client_id',
        'token',
        'session_id',
        'expires_at',
        'used',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
