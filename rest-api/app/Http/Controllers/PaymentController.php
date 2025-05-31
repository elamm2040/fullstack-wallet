<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SoapClientService;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    public function initiate(Request $request, SoapClientService $soap)
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

        $response = $soap->call('initiatePayment', [
            'document' => $client->document,
            'phone' => $client->phone,
            'amount'   => $request->input('amount'),
        ]);

        return response()->json($response, $response['code'] ?? 500);
    }

    public function confirm(Request $request, SoapClientService $soap)
    {
        $validator = Validator::make($request->all(), [
            'session_id' => 'required|uuid',
            'token'      => 'required|string|size:6',
            'amount'     => 'required|numeric|min:1',
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

        $response = $soap->call('confirmPayment', [
            'session_id'  => $request->input('session_id'),
            'token'       => $request->input('token'),
            'amount'      => $request->input('amount'),
        ]);

        return response()->json($response, $response['code'] ?? 500);
    }
}
