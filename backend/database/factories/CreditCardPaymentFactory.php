<?php

namespace Database\Factories;

use App\Models\CreditCard;
use App\Models\CreditCardPayment;
use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;

class CreditCardPaymentFactory extends Factory
{
    protected $model = CreditCardPayment::class;

    public function definition(): array
    {
        return [
            'credit_card_id' => CreditCard::factory(),
            'account_id' => Account::factory(),
            'payment_type' => $this->faker->randomElement(['minimo', 'total', 'otro']),
            'amount' => $this->faker->randomFloat(2, 100, 2000),
            'amount_other' => $this->faker->randomFloat(2, 100, 2000),
            'currency' => 'BOB',
            'payment_date' => now(),
            'status' => $this->faker->randomElement(['pendiente', 'procesado', 'fallido']),
        ];
    }
}
