<?php

namespace App\Http\Requests\Veterinarians;

use Illuminate\Foundation\Http\FormRequest;

class StoreVeterinarianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:120'],
            'last_name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255', 'unique:veterinarians,email'],
            'phone' => ['nullable', 'string', 'max:30'],
            'license_number' => ['required', 'string', 'max:60', 'unique:veterinarians,license_number'],
            'specialty' => ['nullable', 'string', 'max:120'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
