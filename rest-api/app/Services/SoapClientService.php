<?php

namespace App\Services;

use SoapClient;
use SoapFault;

class SoapClientService
{
    protected $client;

    public function __construct()
    {
        try {
            $this->client = new SoapClient(null, [
                'location' => env('SOAP_SERVICE_URL', 'http://localhost:8000/soap'),
                'uri'      => env('SOAP_SERVICE_URI', 'http://localhost:8000/soap'),
                'trace'    => 1,
                'exceptions' => true,
            ]);
        } catch (SoapFault $e) {
            throw new \Exception('Could not connect to SOAP service: ' . $e->getMessage());
        }
    }

    public function call(string $method, array $params = [])
    {
        try {
            return $this->client->__soapCall($method, [$params]);
        } catch (SoapFault $e) {
            return [
                'status' => 'error',
                'code' => 500,
                'message' => $e->getMessage(),
                'data' => [],
            ];
        }
    }
}
