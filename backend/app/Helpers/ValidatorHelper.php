<?php
namespace App\Helpers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ValidatorHelper
{
    public static function validatorMake($requestData, $rules): void
    {
        $validator = Validator::make($requestData, $rules);
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
}




// <?php
// namespace App\Helpers;

// use Illuminate\Support\Facades\Validator;
// use Illuminate\Validation\ValidationException;

// class ValidatorHelper
// {
//     public static function validatorMake($requestData, $rules): void
//     {
//         $validator = Validator::make($requestData, $rules);

//         if ($validator->fails()) {
//             // Obtener solo el primer mensaje de error como string
//             $firstError = collect($validator->errors()->all())->first();

//             // Lanzar la excepción con ese mensaje
//             throw new ValidationException($validator, response()->json([
//                 'message' => $firstError,
//             ], 422));
//         }
//     }
// }
