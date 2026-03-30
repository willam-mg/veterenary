<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Pets\StorePetRequest;
use App\Http\Requests\Pets\UpdatePetRequest;
use App\Http\Resources\PetResource;
use App\Models\Pet;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PetController extends ApiController
{
    public function __construct(private readonly MediaService $mediaService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->string('search'));
        $perPage = min(max((int) $request->integer('per_page', 10), 1), 100);

        $pets = Pet::query()
            ->with('client')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($innerQuery) use ($search): void {
                    $innerQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('species', 'like', "%{$search}%")
                        ->orWhere('breed', 'like', "%{$search}%")
                        ->orWhere('microchip_number', 'like', "%{$search}%")
                        ->orWhereHas('client', function ($clientQuery) use ($search): void {
                            $clientQuery
                                ->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%")
                                ->orWhere('document_number', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return $this->paginatedResponse(
            $pets,
            PetResource::collection($pets->getCollection())->resolve(),
            'Listado de mascotas.'
        );
    }

    public function store(StorePetRequest $request): JsonResponse
    {
        $payload = collect($request->validated())->except(['photo'])->all();
        $payload['photo_path'] = $this->mediaService->store($request->file('photo'), 'pets');

        $pet = Pet::create($payload)->load('client');

        return $this->success(PetResource::make($pet), 'Mascota creada correctamente.', Response::HTTP_CREATED);
    }

    public function show(Pet $pet): JsonResponse
    {
        $pet->load(['client', 'appointments.services', 'appointments.veterinarian', 'clinicalRecords.veterinarian']);

        return $this->success(PetResource::make($pet), 'Detalle de mascota.');
    }

    public function update(UpdatePetRequest $request, Pet $pet): JsonResponse
    {
        $payload = collect($request->validated())->except(['photo'])->all();
        $payload['photo_path'] = $this->mediaService->replace($request->file('photo'), $pet->photo_path, 'pets');

        $pet->update($payload);
        $pet->load('client');

        return $this->success(PetResource::make($pet), 'Mascota actualizada correctamente.');
    }

    public function destroy(Pet $pet): JsonResponse
    {
        $this->mediaService->delete($pet->photo_path);
        $pet->delete();

        return $this->success(null, 'Mascota eliminada correctamente.');
    }
}
