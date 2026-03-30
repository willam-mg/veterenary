<?php

namespace App\Http\Requests\ClinicalRecords;

use Illuminate\Foundation\Http\FormRequest;

class StoreClinicalRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'pet_id' => ['required', 'exists:pets,id'],
            'veterinarian_id' => ['nullable', 'exists:veterinarians,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'record_date' => ['required', 'date'],
            'diagnosis' => ['required', 'string'],
            'treatment' => ['nullable', 'string'],
            'observations' => ['nullable', 'string'],
            'attachment' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
            'weight' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
