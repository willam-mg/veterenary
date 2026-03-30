<?php

namespace App\Enums;

enum CashMovementTypeEnum: string
{
    case OPENING = 'apertura';
    case CLOSURE = 'cierre';
    case INCREMENTO = 'incremento';
    case DISMINUCION = 'disminucion';
    case ARQUEO = 'arqueo';
    case DIFERENCIA = 'diferencia';
    case RETIRO = 'retiro';
    case DEPOSITO = 'deposito';
    // type entity movement
    case CHEQUE = 'cheque';
    case TRANSACTION = 'transaction';
    case TRANSFER = 'transfer';
    case SERVICE_PAYMENT = 'service_payment';
    case CARD_CREDIT_PAYMENT = 'card_credit_payment';
    case CARD_CREDIT_WITHDRAWAL = 'card_credit_withdrawal';
    case LOAN_INSTALLEMENT = 'credit_plazo_fijo_payment';
    case FOREING_EXCHANGE = 'foreign_exchange';
    case EXCHANGE_FRACTIONING = 'exchange_fractioning';
    // to movements not include in balance
    case NOT_INCLUDED_IN_BALANCE = 'not_include_in_balance';

    public function label(): string
    {
        return match ($this) {
            self::OPENING => 'Apertura de caja',
            self::CLOSURE => 'Cierre de caja',
            self::INCREMENTO => 'Incremento',
            self::DISMINUCION => 'Disminución',
            self::ARQUEO => 'Arqueo',
            self::DIFERENCIA => 'Diferencia',
            self::RETIRO => 'Retiro',
            self::DEPOSITO => 'Depósito',
            self::CHEQUE => 'Cheque',
            self::TRANSFER => 'Transferencia',
            self::SERVICE_PAYMENT => 'Pago de servicios',
            self::CARD_CREDIT_PAYMENT => 'Pago tarjeta de credito',
            self::CARD_CREDIT_WITHDRAWAL => 'Retiro tarjeta de credito',
            self::LOAN_INSTALLEMENT => 'Credito a plazo fijo',
            self::FOREING_EXCHANGE => 'Cambio de divisas',
            self::EXCHANGE_FRACTIONING => 'exchange_fractioning',
            self::NOT_INCLUDED_IN_BALANCE => 'No incluido en balance',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
