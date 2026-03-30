<?php

namespace Database\Factories;

use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Client>
 */
class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            // 'email' => fake()->optional()->unique()->safeEmail(),
            'email' => fake()->boolean(70) ? fake()->unique()->safeEmail() : null,
            'phone' => fake()->numerify('7########'),
            // 'document_number' => fake()->optional()->unique()->numerify('DOC-#####'),
            'document_number' => fake()->boolean(70)? fake()->unique()->numerify('DOC-#####'): null,
            'address' => fake()->address(),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
