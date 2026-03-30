<?php
namespace Database\Factories;

use App\Models\Loan;
use App\Models\LoanInstallment;
use Illuminate\Database\Eloquent\Factories\Factory;

class LoanInstallmentFactory extends Factory
{
    protected $model = LoanInstallment::class;

    public function definition(): array
    {
        $balance = $this->faker->randomFloat(2, 5000, 50000); // Saldo inicial
        $annualRate = $this->faker->randomFloat(2, 5, 20); // Tasa Anual
        $monthlyTerm = $this->faker->numberBetween(6, 60); // Plazo mensual

        // Cuota fija estimada (simplificada)
        $fixedInstallment = $balance / $monthlyTerm;

        // Simulación de desglose de la cuota
        $interest = $fixedInstallment * $annualRate / 100 / 12; // interés mensual aproximado
        $capitalAmortization = $fixedInstallment - $interest;
        $insurance = $this->faker->randomFloat(2, 10, 50); // Seguro desgravamen
        $totalInstallment = $fixedInstallment + $insurance;
        $remainingBalance = $balance - $capitalAmortization;

        return [
            'loan_id' => Loan::factory(),
            'installment_number' => 1,
            'amount_due' => $this->faker->randomFloat(2, 100, 500),
            'capital' => $this->faker->randomFloat(2, 10, 100),
            'interest' => $this->faker->randomFloat(2, 10, 100),
            'insurance' => $this->faker->randomFloat(2, 10, 100),
            'amount_paid' => 0,
            'due_date' => $this->faker->dateTimeBetween('now', '+1 year'),
            'payment_date' => null,
            'status' => 'pending',
            'operation_credit'     => round($balance, 2), // FK al préstamo
            'balance'              => round($balance, 2), // Saldo antes del pago
            'monthly_term'         => $monthlyTerm,
            'annual_rate'          => round($annualRate, 2),
            'fixed_installment'    => round($fixedInstallment, 2),
            'interest'             => round($interest, 2),
            'capital_amortization' => round($capitalAmortization, 2),
            'insurance'            => round($insurance, 2),
            'total_installment'    => round($totalInstallment, 2),
            'remaining_balance'    => round($remainingBalance, 2),
        ];
    }
}
