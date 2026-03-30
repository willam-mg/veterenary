<?php

namespace App\Http\Requests\Appointments;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAppointmentRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->filled('scheduled_at')) {
            $this->merge([
                'scheduled_at' => str_replace('T', ' ', (string) $this->input('scheduled_at')),
            ]);
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pet_id' => ['sometimes', 'required', 'exists:pets,id'],
            'veterinarian_id' => ['sometimes', 'required', 'exists:veterinarians,id'],
            'scheduled_at' => ['sometimes', 'required', 'date'],
            'reason' => ['sometimes', 'required', 'string', 'max:255'],
            'status' => ['sometimes', 'in:scheduled,confirmed,completed,cancelled'],
            'notes' => ['nullable', 'string'],
            'services' => ['nullable', 'array'],
            'services.*.id' => ['required_with:services', 'exists:veterinary_services,id'],
            'services.*.quantity' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
