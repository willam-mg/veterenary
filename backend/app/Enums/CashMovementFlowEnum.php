<?php

namespace App\Enums;

enum CashMovementFlowEnum: string
{
    case IN = 'in';
    case OUT = 'out';
    case BOTH = 'both';
    case CONTABLE = 'contable';

    public function label(): string
    {
        return match ($this) {
            self::IN => 'Ingreso',
            self::OUT => 'Egreso',
            self::BOTH => 'Ambos',
            self::CONTABLE => 'Contable',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
