<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\VeterinaryServices\StoreVeterinaryServiceRequest;
use App\Http\Requests\VeterinaryServices\UpdateVeterinaryServiceRequest;
use App\Http\Resources\VeterinaryServiceResource;
use App\Models\VeterinaryService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class VeterinaryServiceController extends ApiController
{
    public function index(): JsonResponse
    {
        return $this->success(
            VeterinaryServiceResource::collection(VeterinaryService::query()->latest()->get()),
            'Listado de servicios veterinarios.'
        );
    }

    public function store(StoreVeterinaryServiceRequest $request): JsonResponse
    {
        $service = VeterinaryService::create($request->validated());

        return $this->success(
            VeterinaryServiceResource::make($service),
            'Servicio veterinario creado correctamente.',
            Response::HTTP_CREATED
        );
    }

    public function show(VeterinaryService $veterinaryService): JsonResponse
    {
        return $this->success(
            VeterinaryServiceResource::make($veterinaryService),
            'Detalle de servicio veterinario.'
        );
    }

    public function update(UpdateVeterinaryServiceRequest $request, VeterinaryService $veterinaryService): JsonResponse
    {
        $veterinaryService->update($request->validated());

        return $this->success(
            VeterinaryServiceResource::make($veterinaryService),
            'Servicio veterinario actualizado correctamente.'
        );
    }

    public function destroy(VeterinaryService $veterinaryService): JsonResponse
    {
        $veterinaryService->delete();

        return $this->success(null, 'Servicio veterinario eliminado correctamente.');
    }
}
