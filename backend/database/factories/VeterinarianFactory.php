<?php

namespace Database\Factories;

use App\Models\Veterinarian;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Veterinarian>
 */
class VeterinarianFactory extends Factory
{
    protected $model = Veterinarian::class;

    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->numerify('7########'),
            'license_number' => fake()->unique()->numerify('COL-#####'),
            'specialty' => fake()->randomElement(['Medicina general', 'Dermatologia', 'Cirugia']),
            'is_active' => true,
        ];
    }
}
