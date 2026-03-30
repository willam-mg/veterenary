<?php

namespace Database\Factories;

use App\Models\Cashier;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class CashierFactory extends Factory
{
    protected $model = Cashier::class;

    public function definition()
    {
        $user = User::factory()->create([
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'),
        ]);

        return [
            'name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'address' => $this->faker->address(),
            'shift' => $this->faker->randomElement(['mañana', 'tarde', 'noche']),
            'photo_src' => $this->faker->imageUrl(640, 480, 'people'),
            'user_id' => $user->id
        ];
    }

    /**
     * Indicate that the admin member has a specific photo.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withPhoto($photoUrl)
    {
        return $this->state([
            'photo_src' => $photoUrl,
        ]);
    }
}
