<?php

namespace App\Http\Controllers;

use App\Helpers\UtilHelper;
use App\Helpers\ValidatorHelper;

abstract class Controller
{
    public function validatorMake($request, $rules): void
    {
        ValidatorHelper::validatorMake($request, $rules);
    }
    
    public function getCurrentDate() {
        return UtilHelper::getCurrentDate();
    }

    public function getCurrentTime() {
        return UtilHelper::getCurrentTime();
    }

    public function getEmployeeId()
    {
        return UtilHelper::getEmployeeId();
    }
}
