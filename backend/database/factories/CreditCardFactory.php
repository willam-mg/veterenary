<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\CreditCard;
use Illuminate\Database\Eloquent\Factories\Factory;

class CreditCardFactory extends Factory
{
    protected $model = CreditCard::class;

    public function definition(): array
    {
        return [
            'account_id' => Account::factory(),
            'number' => $this->faker->unique()->creditCardNumber(),
            'holder_name' => $this->faker->name(),
            'credit_limit' => $this->faker->randomFloat(2, 1000, 10000),
            'balance' => $this->faker->randomFloat(2, 0, 5000),
            'interest_rate' => $this->faker->randomFloat(2, 1, 5),
            'minimum_amount' => $this->faker->randomFloat(2, 1, 5),
            'total_amount' => $this->faker->randomFloat(2, 1, 5),
            'status' => $this->faker->randomElement(['active', 'blocked', 'closed']),
        ];
    }
}
