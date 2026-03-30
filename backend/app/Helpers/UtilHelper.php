<?php
namespace App\Helpers;

use App\Models\Admin;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class UtilHelper
{
    public static function getCurrentDate() {
        return Carbon::parse(Carbon::now())
            ->setTimezone(config('timezone'))
            ->format('Y-m-d');
    }

    public static function getCurrentTime() {
        return Carbon::parse(Carbon::now())
            ->setTimezone(config('timezone'))
            ->format('H:i:s');
    }

    public static function getEmployeeId()
    {
        return optional(self::getCurrentEmployee())->id;
    }

    public static function getCurrentEmployee()
    {
        $user = auth()->guard()->user();
        return Admin::where('user_id', $user->id)->first();
    }
}
