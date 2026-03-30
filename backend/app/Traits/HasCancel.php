<?php

namespace App\Traits;

use App\Scopes\NotCanceledScope;

trait HasCancel
{
    public static function bootHasCancel()
    {
        static::addGlobalScope(new NotCanceledScope);
    }

    /**
     * Trae todos los registros, incluidos los cancelados.
     */
    public static function withCanceled()
    {
        return static::withoutGlobalScope(NotCanceledScope::class);
    }

    /**
     * Trae solo los cancelados.
     */
    public static function onlyCanceled()
    {
        return static::withoutGlobalScope(NotCanceledScope::class)
            ->where('canceled', true);
    }
}
