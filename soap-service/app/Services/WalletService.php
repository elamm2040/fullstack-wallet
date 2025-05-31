<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Wallet;
use App\Models\ConfirmationToken;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class WalletService
{
    public function recharge(array $data): bool
    {
        $validator = Validator::make($data, [
            'document' => 'required|string',
            'phone'    => 'required|string',
            'amount'   => 'required|numeric',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $client = Client::where('document', $data['document'])
            ->where('phone', $data['phone'])
            ->first();

        if (!$client || !$client->wallet) {
            throw ValidationException::withMessages(['client' => 'Client not found or wallet not initialized.']);
        }

        $client->wallet->balance += $data['amount'];
        return $client->wallet->save();
    }

    public function initiatePayment(array $data): array
    {
        $validator = Validator::make($data, [
            'document' => 'required|string',
            'phone'    => 'required|string',
            'amount'   => 'required|numeric',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $client = Client::where('document', $data['document'])
            ->where('phone', $data['phone'])
            ->first();

        if (!$client || !$client->wallet || $client->wallet->balance < $data['amount']) {
            throw ValidationException::withMessages(['payment' => 'Insufficient funds or client not found.']);
        }

        $token = app(TokenService::class)->generateToken($client->id);
        $sessionId = (string)Str::uuid();

        ConfirmationToken::create([
            'client_id' => $client->id,
            'token' => $token,
            'session_id' => $sessionId,
            'expires_at' => Carbon::now()->addMinutes(10),
            'used' => false,
        ]);

        Mail::raw("Your confirmation token is: $token", function ($message) use ($client) {
            $message->to($client->email)->subject('Payment Confirmation Token');
        });

        return [
            'message' => 'Token sent to user email.',
            'session_id' => $sessionId,
        ];
    }

    public function confirmPayment(array $data): bool
    {
        $validator = Validator::make($data, [
            'session_id' => 'required|uuid',
            'token'      => 'required|string',
            'amount'     => 'required|numeric',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $confirmation = ConfirmationToken::where('session_id', $data['session_id'])
            ->where('token', $data['token'])
            ->where('used', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$confirmation) {
            throw ValidationException::withMessages(['token' => 'Invalid or expired token.']);
        }

        $client = $confirmation->client;

        if (!$client || !$client->wallet || $client->wallet->balance < $data['amount']) {
            throw ValidationException::withMessages(['payment' => 'Client not found or insufficient funds.']);
        }

        $client->wallet->balance -= $data['amount'];
        $client->wallet->save();

        $confirmation->used = true;
        $confirmation->save();

        return true;
    }

    public function getBalance(array $data): float
    {
        $validator = Validator::make($data, [
            'document' => 'required|string',
            'phone'    => 'required|string',
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        $client = Client::where('document', $data['document'])
            ->where('phone', $data['phone'])
            ->first();

        if (!$client || !$client->wallet) {
            throw ValidationException::withMessages(['client' => 'Client or wallet not found.']);
        }

        return $client->wallet->balance;
    }
}
