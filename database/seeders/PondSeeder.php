<?php

namespace Database\Seeders;

use App\Models\Pond;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PondSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pond::factory()->count(50)->create();
    }
}
