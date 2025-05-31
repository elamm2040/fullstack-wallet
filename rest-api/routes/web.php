<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->options(
    '/{any:.*}',
    function () {
        return response('', 200);
    }
);

$router->post('/login', 'AuthController@login');
$router->post('/register-client', 'ClientController@register');

$router->group(['middleware' => 'auth:api'], function () use ($router) {
    $router->get('/me', 'AuthController@me');
    $router->get('/wallet', 'WalletController@getBalance');
    $router->post('/wallet/recharge', 'WalletController@recharge');
    $router->post('/payment/initiate', 'PaymentController@initiate');
    $router->post('/payment/confirm', 'PaymentController@confirm');
});
