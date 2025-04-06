<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pond>
 */
class PondFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => $this->faker->uuid(),
            'location' => $this->faker->randomElement(['Inland Brackish Pond Zone', 'Coastal Pond Zone', 'River Pond Area']),
            'size' => $this->faker->numberBetween(100, 10000),
            'water_type' => $this->faker->randomElement(['Fresh', 'Brackish']),
            'setup_date' => $this->faker->date(),
        ];
    }
}
