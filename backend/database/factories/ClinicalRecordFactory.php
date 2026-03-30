<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\ClinicalRecord;
use App\Models\Pet;
use App\Models\Veterinarian;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ClinicalRecord>
 */
class ClinicalRecordFactory extends Factory
{
    protected $model = ClinicalRecord::class;

    public function definition(): array
    {
        return [
            'pet_id' => Pet::factory(),
            'veterinarian_id' => Veterinarian::factory(),
            'appointment_id' => Appointment::factory(),
            'record_date' => fake()->date(),
            'diagnosis' => fake()->sentence(),
            'treatment' => fake()->optional()->sentence(),
            'observations' => fake()->optional()->paragraph(),
            'weight' => fake()->randomFloat(2, 1.5, 25),
        ];
    }
}
