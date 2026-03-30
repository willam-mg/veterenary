<?php

namespace App\Http\Requests\Pets;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $pet = $this->route('pet');

        return [
            'client_id' => ['sometimes', 'required', 'exists:clients,id'],
            'name' => ['sometimes', 'required', 'string', 'max:120'],
            'species' => ['sometimes', 'required', 'string', 'max:60'],
            'breed' => ['nullable', 'string', 'max:120'],
            'sex' => ['nullable', 'in:male,female,unknown'],
            'birth_date' => ['nullable', 'date'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'color' => ['nullable', 'string', 'max:60'],
            'microchip_number' => ['nullable', 'string', 'max:60', Rule::unique('pets', 'microchip_number')->ignore($pet)],
            'allergies' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
