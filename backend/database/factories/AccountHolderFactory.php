<?php

namespace Database\Factories;

use App\Models\AccountHolder;
use App\Models\AccountHolderSignature;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admin>
 */
class AccountHolderFactory extends Factory
{
    protected $model = AccountHolder::class;

    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'ci' => $this->faker->unique()->numberBetween(1000000, 9999999),
            'ci_extencion' => $this->faker->randomElement([
                'cbba.', 'scz.', 'lpz.', 'or.', 'trj.', 'src.', 'pts.', 'bni.', 'pnd.'
            ])
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (AccountHolder $accountHolder) {
            AccountHolderSignature::factory()
                ->count(rand(1, 2))
                ->create([
                    'account_holder_id' => $accountHolder->id,
                ]);
        });
    }
}
