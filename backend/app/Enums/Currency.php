<?php
namespace App\Enums;
class Currency
{
    public const BOB = 'BOB';
    public const USD = 'USD';
    public const EUR = 'EUR';

    // RATES
    public const RATE_EXCHANGE_BOB_USD = 6.5;

    public const SYMBOLS = [
        self::BOB => 'Bs.',
        self::USD => '$',
        self::EUR => '€',
    ];

    public const NAMES = [
        self::BOB => 'Bolivianos',
        self::USD => 'Dolares',
        self::EUR => 'Euros',
    ];
}