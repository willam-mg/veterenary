<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ClientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'document_number' => $this->document_number,
            'address' => $this->address,
            'notes' => $this->notes,
            'photo_url' => $this->photo_path 
                ? asset('storage/' . $this->photo_path) 
                : null,
            'pets_count' => $this->whenCounted('pets'),
            'pets' => PetResource::collection($this->whenLoaded('pets')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
