<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'client_id' => $this->client_id,
            'name' => $this->name,
            'species' => $this->species,
            'breed' => $this->breed,
            'sex' => $this->sex,
            'birth_date' => optional($this->birth_date)->toDateString(),
            'weight' => $this->weight,
            'color' => $this->color,
            'microchip_number' => $this->microchip_number,
            'allergies' => $this->allergies,
            'notes' => $this->notes,
            'photo_url' => $this->photo_path 
                ? asset('storage/' . $this->photo_path) 
                : null,
            'is_active' => $this->is_active,
            'client' => ClientResource::make($this->whenLoaded('client')),
            'clinical_records' => ClinicalRecordResource::collection($this->whenLoaded('clinicalRecords')),
            'appointments' => AppointmentResource::collection($this->whenLoaded('appointments')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
