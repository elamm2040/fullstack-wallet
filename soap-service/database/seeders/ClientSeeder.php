<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;
use Illuminate\Support\Facades\Hash;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 15; $i++) {
            Client::create([
                'document' => str_pad((string)rand(10000000, 99999999), 10, '0', STR_PAD_LEFT),
                'name'     => "Client $i",
                'email'    => "client$i@example.com",
                'phone'    => "30012345" . str_pad((string)$i, 2, '0', STR_PAD_LEFT),
                'password' => Hash::make('123456'),
            ]);
        }
    }
}
