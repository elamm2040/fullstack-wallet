<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SoapClientService;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{
    public function getBalance(SoapClientService $soap)
    {
        $client = auth()->user();

        $response = $soap->call('getBalance', [
            'document' => $client->document,
            'phone' => $client->phone,
        ]);

        return response()->json($response, $response['code'] ?? 500);
    }

    public function recharge(Request $request, SoapClientService $soap)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'code' => 422,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $client = auth()->user();

        $response = $soap->call('rechargeWallet', [
            'document' => $client->document,
            'phone' => $client->phone,
            'amount'   => $request->input('amount'),
        ]);

        return response()->json($response, $response['code'] ?? 500);
    }
}
