<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pet_id' => $this->pet_id,
            'veterinarian_id' => $this->veterinarian_id,
            'scheduled_at' => optional($this->scheduled_at)->toIso8601String(),
            'reason' => $this->reason,
            'status' => $this->status,
            'notes' => $this->notes,
            'pet' => PetResource::make($this->whenLoaded('pet')),
            'veterinarian' => VeterinarianResource::make($this->whenLoaded('veterinarian')),
            'services' => VeterinaryServiceResource::collection($this->whenLoaded('services')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
