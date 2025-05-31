<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Auth\Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Client extends Model implements AuthenticatableContract, JWTSubject
{
    use Authenticatable;

    protected $table = 'clients';

    protected $fillable = [
        'name',
        'email',
        'document',
        'phone',
        'password'
    ];

    protected $hidden = [
        'password',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
