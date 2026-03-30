<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Pet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pet>
 */
class PetFactory extends Factory
{
    protected $model = Pet::class;

    public function definition(): array
    {
        return [
            'client_id' => Client::factory(),
            'name' => fake()->firstName(),
            'species' => fake()->randomElement(['dog', 'cat']),
            'breed' => fake()->randomElement(['Mestizo', 'Labrador', 'Siames']),
            'sex' => fake()->randomElement(['male', 'female']),
            'birth_date' => fake()->dateTimeBetween('-10 years', '-3 months')->format('Y-m-d'),
            'weight' => fake()->randomFloat(2, 1.5, 28),
            'color' => fake()->safeColorName(),
            'microchip_number' => fake()->boolean(70)? fake()->unique()->numerify('MC-######'): null,
            'allergies' => fake()->optional()->sentence(),
            'notes' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }
}
