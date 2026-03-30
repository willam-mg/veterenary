<?php

namespace Database\Factories;

use App\Enums\AccountTypeEnum;
use App\Models\Account;
use App\Models\AccountHolder;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AccountFactory extends Factory
{
    protected $model = Account::class;

    public function definition()
    {
        $typeAccount = $this->faker->randomElement(AccountTypeEnum::cases())->value;
        $currency = $this->faker->randomElement(['BOB', 'USD']);
        $endExtNumerAccount = $currency == 'BOB' ? '2' : '3';
        $numberAccount = $typeAccount == AccountTypeEnum::SAVINGS->value ? $this->faker->numberBetween(10000, 99999): $this->faker->numberBetween(100000, 999999);
        $numberAccount .= $endExtNumerAccount;
        return [
            'account_number' => $numberAccount,
            'client_name' => $this->faker->name,
            'type' => $typeAccount,
            'balance' => $this->faker->randomFloat(2, 0, 1000),
            'currency' => $currency,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Account $account) {
            AccountHolder::factory()
                ->count(rand(1, 3))
                ->create([
                    'account_id' => $account->id,
                ]);
        });
    }
}
