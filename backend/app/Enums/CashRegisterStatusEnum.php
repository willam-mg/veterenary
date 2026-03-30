<?php

namespace App\Enums;

enum CashRegisterStatusEnum: string
{
    case OPENED = 'abierta';
    case CLOSED = 'cerrada';

    public function label(): string
    {
        return match ($this) {
            self::OPENED => 'Abierta',
            self::CLOSED => 'Cerrada',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
