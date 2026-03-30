<?php

namespace Database\Factories;

use App\Models\VeterinaryService;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<VeterinaryService>
 */
class VeterinaryServiceFactory extends Factory
{
    protected $model = VeterinaryService::class;

    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Consulta general',
            'Vacunacion anual',
            'Desparasitacion',
            'Control de peso',
        ]);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1, 999),
            'description' => fake()->sentence(),
            'duration_minutes' => fake()->randomElement([15, 30, 45, 60]),
            'price' => fake()->randomFloat(2, 40, 200),
            'is_active' => true,
        ];
    }
}
