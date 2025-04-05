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
        Schema::create('crabs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('species', ['Mud Crab']);
            $table->string('age_value');
            $table->enum('age_unit', ['days', 'weeks', 'months']);
            $table->decimal('weight', 8, 2);
            $table->enum('gender', ['Male', 'Female', 'Undetermined']);
            // $table->uuid('pond_id');
            $table->enum('health_status', ['Healthy', 'Weak', 'Diseased']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crabs');
    }
};
