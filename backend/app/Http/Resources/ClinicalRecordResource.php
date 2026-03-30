<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ClinicalRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pet_id' => $this->pet_id,
            'veterinarian_id' => $this->veterinarian_id,
            'appointment_id' => $this->appointment_id,
            'record_date' => optional($this->record_date)->toDateString(),
            'diagnosis' => $this->diagnosis,
            'treatment' => $this->treatment,
            'observations' => $this->observations,
            'attachment_url' => $this->attachment_path 
                ? asset('storage/' . $this->attachment_path) 
                : null,
            'weight' => $this->weight,
            'pet' => PetResource::make($this->whenLoaded('pet')),
            'veterinarian' => VeterinarianResource::make($this->whenLoaded('veterinarian')),
            'appointment' => AppointmentResource::make($this->whenLoaded('appointment')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
