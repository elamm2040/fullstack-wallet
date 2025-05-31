<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SoapWalletController;

Route::post('/soap', [SoapWalletController::class, 'handle']);
