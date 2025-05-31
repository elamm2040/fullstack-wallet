<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class VerifyDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:verify';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks if the database exists and creates it if it does not';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $database = config('database.connections.mysql.database');
        $charset = config('database.connections.mysql.charset', 'utf8mb4');
        $collation = config('database.connections.mysql.collation', 'utf8mb4_unicode_ci');

        // Temporarily disable database name to avoid connection error
        config(['database.connections.mysql.database' => null]);

        DB::statement("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET $charset COLLATE $collation");

        // Restore database name
        config(['database.connections.mysql.database' => $database]);

        $this->info("✅ Database '$database' successfully verified or created.");
    }
}
