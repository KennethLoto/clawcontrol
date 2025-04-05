<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Crab>
 */
class CrabFactory extends Factory
{
    public function definition(): array
    {
        $date = Carbon::now()->format('Y-m-d');
        $randomNumber = str_pad($this->faker->numberBetween(1, 9999), 4, '0', STR_PAD_LEFT);

        return [
            'id' => $this->faker->uuid(),
            'tag_id' => "CRB-{$date}-{$randomNumber}",
            'species' => 'Mud Crab',
            'age_value' => $this->faker->numberBetween(1, 12),
            'age_unit' => $this->faker->randomElement(['days', 'weeks', 'months']),
            'weight' => $this->faker->randomFloat(2, 0.1, 2.0),
            'gender' => $this->faker->randomElement(['Male', 'Female', 'Undetermined']),
            'health_status' => $this->faker->randomElement(['Healthy', 'Weak', 'Diseased']),
        ];
    }
}
