<?php

namespace App\Http\Requests\Veterinarians;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVeterinarianRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $veterinarian = $this->route('veterinarian');

        return [
            'first_name' => ['sometimes', 'required', 'string', 'max:120'],
            'last_name' => ['sometimes', 'required', 'string', 'max:120'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('veterinarians', 'email')->ignore($veterinarian)],
            'phone' => ['nullable', 'string', 'max:30'],
            'license_number' => ['sometimes', 'required', 'string', 'max:60', Rule::unique('veterinarians', 'license_number')->ignore($veterinarian)],
            'specialty' => ['nullable', 'string', 'max:120'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
