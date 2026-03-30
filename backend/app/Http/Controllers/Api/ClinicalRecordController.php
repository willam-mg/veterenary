<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ClinicalRecords\StoreClinicalRecordRequest;
use App\Http\Requests\ClinicalRecords\UpdateClinicalRecordRequest;
use App\Http\Resources\ClinicalRecordResource;
use App\Models\ClinicalRecord;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ClinicalRecordController extends ApiController
{
    public function __construct(private readonly MediaService $mediaService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->string('search'));
        $perPage = min(max((int) $request->integer('per_page', 10), 1), 100);

        $records = ClinicalRecord::query()
            ->with(['pet.client', 'veterinarian', 'appointment'])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($innerQuery) use ($search): void {
                    $innerQuery
                        ->where('diagnosis', 'like', "%{$search}%")
                        ->orWhere('treatment', 'like', "%{$search}%")
                        ->orWhere('observations', 'like', "%{$search}%")
                        ->orWhereHas('pet', function ($petQuery) use ($search): void {
                            $petQuery->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('veterinarian', function ($vetQuery) use ($search): void {
                            $vetQuery
                                ->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest('record_date')
            ->paginate($perPage)
            ->withQueryString();

        return $this->paginatedResponse(
            $records,
            ClinicalRecordResource::collection($records->getCollection())->resolve(),
            'Listado de historiales clínicos.'
        );
    }

    public function store(StoreClinicalRecordRequest $request): JsonResponse
    {
        $payload = collect($request->validated())->except(['attachment'])->all();
        $payload['attachment_path'] = $this->mediaService->store($request->file('attachment'), 'clinical-records');

        $record = ClinicalRecord::create($payload)
            ->load(['pet.client', 'veterinarian', 'appointment']);

        return $this->success(
            ClinicalRecordResource::make($record),
            'Historial clínico creado correctamente.',
            Response::HTTP_CREATED
        );
    }

    public function show(ClinicalRecord $clinicalRecord): JsonResponse
    {
        $clinicalRecord->load(['pet.client', 'veterinarian', 'appointment']);

        return $this->success(ClinicalRecordResource::make($clinicalRecord), 'Detalle de historial clínico.');
    }

    public function update(UpdateClinicalRecordRequest $request, ClinicalRecord $clinicalRecord): JsonResponse
    {
        $payload = collect($request->validated())->except(['attachment'])->all();
        $payload['attachment_path'] = $this->mediaService->replace(
            $request->file('attachment'),
            $clinicalRecord->attachment_path,
            'clinical-records'
        );

        $clinicalRecord->update($payload);
        $clinicalRecord->load(['pet.client', 'veterinarian', 'appointment']);

        return $this->success(
            ClinicalRecordResource::make($clinicalRecord),
            'Historial clínico actualizado correctamente.'
        );
    }

    public function destroy(ClinicalRecord $clinicalRecord): JsonResponse
    {
        $this->mediaService->delete($clinicalRecord->attachment_path);
        $clinicalRecord->delete();

        return $this->success(null, 'Historial clínico eliminado correctamente.');
    }
}
