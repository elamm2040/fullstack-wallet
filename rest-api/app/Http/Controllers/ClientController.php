<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SoapClientService;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    public function register(Request $request, SoapClientService $soap)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|string|max:20',
            'name'     => 'required|string|max:100',
            'email'    => 'required|email|max:100',
            'phone'    => 'required|string|max:20',
            'password' => 'required|string|min:6|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'code'   => 422,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $response = $soap->call('registerClient', $validated);

        return response()->json($response, $response['code'] ?? 500);
    }
}
