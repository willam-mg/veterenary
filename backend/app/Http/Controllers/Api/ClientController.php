<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Clients\StoreClientRequest;
use App\Http\Requests\Clients\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ClientController extends ApiController
{
    public function __construct(private readonly MediaService $mediaService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->string('search'));
        $perPage = min(max((int) $request->integer('per_page', 10), 1), 100);

        $clients = Client::query()
            ->withCount('pets')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($innerQuery) use ($search): void {
                    $innerQuery
                        ->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('document_number', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();

        return $this->paginatedResponse(
            $clients,
            ClientResource::collection($clients->getCollection())->resolve(),
            'Listado de clientes.'
        );
    }

    public function store(StoreClientRequest $request): JsonResponse
    {
        $payload = collect($request->validated())->except(['photo'])->all();
        $payload['photo_path'] = $this->mediaService->store($request->file('photo'), 'clients');

        $client = Client::create($payload);

        return $this->success(ClientResource::make($client), 'Cliente creado correctamente.', Response::HTTP_CREATED);
    }

    public function show(Client $client): JsonResponse
    {
        $client->load(['pets.appointments', 'pets.clinicalRecords']);

        return $this->success(ClientResource::make($client), 'Detalle de cliente.');
    }

    public function update(UpdateClientRequest $request, Client $client): JsonResponse
    {
        $payload = collect($request->validated())->except(['photo'])->all();
        $payload['photo_path'] = $this->mediaService->replace($request->file('photo'), $client->photo_path, 'clients');

        $client->update($payload);

        return $this->success(ClientResource::make($client), 'Cliente actualizado correctamente.');
    }

    public function destroy(Client $client): JsonResponse
    {
        $this->mediaService->delete($client->photo_path);
        $client->delete();

        return $this->success(null, 'Cliente eliminado correctamente.');
    }
}
