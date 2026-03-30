<?php

namespace App\Http\Requests\ClinicalRecords;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClinicalRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pet_id' => ['sometimes', 'required', 'exists:pets,id'],
            'veterinarian_id' => ['nullable', 'exists:veterinarians,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'record_date' => ['sometimes', 'required', 'date'],
            'diagnosis' => ['sometimes', 'required', 'string'],
            'treatment' => ['nullable', 'string'],
            'observations' => ['nullable', 'string'],
            'attachment' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'weight' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
