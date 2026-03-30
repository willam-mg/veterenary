<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Veterinarians\StoreVeterinarianRequest;
use App\Http\Requests\Veterinarians\UpdateVeterinarianRequest;
use App\Http\Resources\VeterinarianResource;
use App\Models\Veterinarian;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VeterinarianController extends ApiController
{
    public function __construct(private readonly MediaService $mediaService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->string('search'));
        $perPage = min(max((int) $request->integer('per_page', 10), 1), 100);

        $veterinarians = Veterinarian::query()
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($innerQuery) use ($search): void {
                    $innerQuery
                        ->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('license_number', 'like', "%{$search}%")
                        ->orWhere('specialty', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return $this->paginatedResponse(
            $veterinarians,
            VeterinarianResource::collection($veterinarians->getCollection())->resolve(),
            'Listado de veterinarios.'
        );
    }

    public function store(StoreVeterinarianRequest $request): JsonResponse
    {
        $payload = collect($request->validated())->except(['photo'])->all();
        $payload['photo_path'] = $this->mediaService->store($request->file('photo'), 'veterinarians');

        $veterinarian = Veterinarian::create($payload);

        return $this->success(
            VeterinarianResource::make($veterinarian),
            'Veterinario creado correctamente.',
            Response::HTTP_CREATED
        );
    }

    public function show(Veterinarian $veterinarian): JsonResponse
    {
        return $this->success(VeterinarianResource::make($veterinarian), 'Detalle de veterinario.');
    }

    public function update(UpdateVeterinarianRequest $request, Veterinarian $veterinarian): JsonResponse
    {
        $payload = collect($request->validated())->except(['photo'])->all();
        $payload['photo_path'] = $this->mediaService->replace(
            $request->file('photo'),
            $veterinarian->photo_path,
            'veterinarians'
        );

        $veterinarian->update($payload);

        return $this->success(VeterinarianResource::make($veterinarian), 'Veterinario actualizado correctamente.');
    }

    public function destroy(Veterinarian $veterinarian): JsonResponse
    {
        $this->mediaService->delete($veterinarian->photo_path);
        $veterinarian->delete();

        return $this->success(null, 'Veterinario eliminado correctamente.');
    }
}
