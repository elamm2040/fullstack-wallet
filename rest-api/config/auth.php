<?php

return [

    'defaults' => [
        'guard' => 'api',
    ],

    'guards' => [
        'api' => [
            'driver' => 'jwt',
            'provider' => 'clients',
        ],
    ],

    'providers' => [
        'clients' => [
            'driver' => 'eloquent',
            'model' => App\Models\Client::class,
        ],
    ],
];
