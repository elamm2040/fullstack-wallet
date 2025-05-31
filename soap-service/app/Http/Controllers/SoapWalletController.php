<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ClientService;
use App\Services\WalletService;
use SoapServer;
use Exception;

class SoapWalletController extends Controller
{
    public function handle(Request $request)
    {
        $options = ['uri' => $request->url()];

        $server = new SoapServer(null, $options);
        $server->setObject(new class {
            public function registerClient(array $data)
            {
                try {
                    $client = app(ClientService::class)->register([
                        'document' => $data['document'],
                        'name'     => $data['name'],
                        'email'    => $data['email'],
                        'phone'    => $data['phone'],
                        'password' => $data['password'],
                    ]);

                    return [
                        'status'  => 'success',
                        'code'    => 200,
                        'message' => 'Client registered successfully',
                        'data'    => $client->toArray(),
                    ];
                } catch (Exception $e) {
                    return [
                        'status'  => 'error',
                        'code'    => 500,
                        'message' => $e->getMessage(),
                        'data'    => [],
                    ];
                }
            }

            public function rechargeWallet(array $data)
            {
                try {
                    $success = app(WalletService::class)->recharge($data);

                    return [
                        'status'  => $success ? 'success' : 'error',
                        'code'    => $success ? 200 : 400,
                        'message' => $success ? 'Wallet recharged successfully' : 'Recharge failed',
                        'data'    => [],
                    ];
                } catch (Exception $e) {
                    return [
                        'status'  => 'error',
                        'code'    => 500,
                        'message' => $e->getMessage(),
                        'data'    => [],
                    ];
                }
            }

            public function initiatePayment(array $data)
            {
                try {
                    $response = app(WalletService::class)->initiatePayment($data);

                    return [
                        'status'     => 'success',
                        'code'       => 200,
                        'message'    => $response['message'],
                        'session_id' => $response['session_id'],
                        'data'       => [],
                    ];
                } catch (Exception $e) {
                    return [
                        'status'  => 'error',
                        'code'    => 500,
                        'message' => $e->getMessage(),
                        'data'    => [],
                    ];
                }
            }

            public function confirmPayment(array $data)
            {
                try {
                    $success = app(WalletService::class)->confirmPayment($data);

                    return [
                        'status'  => $success ? 'success' : 'error',
                        'code'    => $success ? 200 : 400,
                        'message' => $success ? 'Payment confirmed successfully' : 'Payment confirmation failed',
                        'data'    => [],
                    ];
                } catch (Exception $e) {
                    return [
                        'status'  => 'error',
                        'code'    => 500,
                        'message' => $e->getMessage(),
                        'data'    => [],
                    ];
                }
            }

            public function getBalance(array $data)
            {
                try {
                    $balance = app(WalletService::class)->getBalance($data);

                    return [
                        'status'  => 'success',
                        'code'    => 200,
                        'message' => 'Balance retrieved successfully',
                        'data'    => ['balance' => $balance],
                    ];
                } catch (Exception $e) {
                    return [
                        'status'  => 'error',
                        'code'    => 500,
                        'message' => $e->getMessage(),
                        'data'    => [],
                    ];
                }
            }
        });

        ob_start();
        $server->handle();
        return response(ob_get_clean())->header('Content-Type', 'text/xml');
    }
}
