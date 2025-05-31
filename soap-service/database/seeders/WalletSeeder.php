<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Wallet;
use App\Models\Client;

class WalletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = Client::all();

        foreach ($clients as $client) {
            Wallet::create([
                'client_id' => $client->id,
                'balance'   => rand(500, 5000),
            ]);
        }
    }
}
