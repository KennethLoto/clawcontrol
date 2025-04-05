<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Crab>
 */
class CrabFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id' => $this->faker->uuid(),
            'species' => 'Mud Crab',
            'age_value' => $this->faker->numberBetween(1, 12),
            'age_unit' => $this->faker->randomElement(['days', 'weeks', 'months']),
            'weight' => $this->faker->randomFloat(2, 0.1, 2.0),
            'gender' => $this->faker->randomElement(['Male', 'Female', 'Undetermined']),
            'health_status' => $this->faker->randomElement(['Healthy', 'Weak', 'Diseased']),
        ];
    }
}
