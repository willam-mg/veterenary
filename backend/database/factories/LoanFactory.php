<?php
namespace Database\Factories;

use App\Models\Account;
use App\Models\Loan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class LoanFactory extends Factory
{
    protected $model = Loan::class;

    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-2 years', 'now');
        $term = $this->faker->numberBetween(6, 36);
        $monthlyPayment = $this->faker->randomFloat(2, 100, 1000);

        return [
            'account_id' => Account::factory(),
            'loan_number' => strtoupper(Str::random(10)),
            'amount' => $monthlyPayment * $term,
            'interest_rate' => $this->faker->randomFloat(2, 5, 20),
            'term_months' => $term,
            'monthly_payment' => $monthlyPayment,
            'start_date' => $startDate,
            'end_date' => (clone $startDate)->modify("+{$term} months"),
            'currency' => 'BOB',
            'status' => 'active',
        ];
    }
}
