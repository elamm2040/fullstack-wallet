<?php

namespace App\Services;

use App\Models\Client;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ClientService
{
    public function register(array $data): Client
    {
        return DB::transaction(function () use ($data) {
            $validator = Validator::make($data, [
                'document' => 'required|string|unique:clients,document',
                'name'     => 'required|string|max:255',
                'email'    => 'required|email|unique:clients,email',
                'phone'    => 'required|string|max:20',
                'password' => 'required|string|min:6|max:100',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            $data['password'] = Hash::make($data['password']);

            $client = Client::create($data);

            $client->wallet()->create([
                'balance' => 0.00,
            ]);

            return $client;
        });
    }
}
