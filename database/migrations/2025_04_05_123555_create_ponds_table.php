<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ponds', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('location', ['Inland Brackish Pond Zone', 'Coastal Pond Zone', 'River Pond Area']);
            $table->float('size');
            $table->enum('water_type', ['Brackish', 'Fresh']);
            $table->date('setup_date');
            $table->float('current_ph')->nullable();
            $table->float('current_temperature')->nullable();
            $table->float('current_oxygen')->nullable();
            $table->integer('crab_population')->nullable();
            $table->text('water_quality_log')->nullable();
            $table->text('maintenance_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ponds');
    }
};
