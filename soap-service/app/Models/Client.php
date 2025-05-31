<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'document',
        'name',
        'email',
        'phone',
        'password',
    ];

    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }

    public function confirmationTokens(): HasMany
    {
        return $this->hasMany(ConfirmationToken::class);
    }
}
