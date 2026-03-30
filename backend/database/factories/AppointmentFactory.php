<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Pet;
use App\Models\Veterinarian;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        return [
            'pet_id' => Pet::factory(),
            'veterinarian_id' => Veterinarian::factory(),
            'scheduled_at' => fake()->dateTimeBetween('now', '+10 days'),
            'reason' => fake()->randomElement(['Vacunacion', 'Control general', 'Revision dermatologica']),
            'status' => fake()->randomElement(['scheduled', 'confirmed', 'completed']),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
