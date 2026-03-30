<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Appointments\StoreAppointmentRequest;
use App\Http\Requests\Appointments\UpdateAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AppointmentController extends ApiController
{
    public function __construct(private readonly AppointmentService $appointmentService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $search = trim((string) $request->string('search'));
        $perPage = min(max((int) $request->integer('per_page', 10), 1), 100);

        $appointments = Appointment::query()
            ->with(['pet.client', 'veterinarian', 'services'])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($innerQuery) use ($search): void {
                    $innerQuery
                        ->where('reason', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhereHas('pet', function ($petQuery) use ($search): void {
                            $petQuery->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('veterinarian', function ($vetQuery) use ($search): void {
                            $vetQuery
                                ->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('pet.client', function ($clientQuery) use ($search): void {
                            $clientQuery
                                ->where('first_name', 'like', "%{$search}%")
                                ->orWhere('last_name', 'like', "%{$search}%");
                        });
                });
            })
            ->orderBy('scheduled_at')
            ->paginate($perPage)
            ->withQueryString();

        return $this->paginatedResponse(
            $appointments,
            AppointmentResource::collection($appointments->getCollection())->resolve(),
            'Listado de citas.'
        );
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $appointment = $this->appointmentService->create($request->validated());

        return $this->success(
            AppointmentResource::make($appointment),
            'Cita creada correctamente.',
            Response::HTTP_CREATED
        );
    }

    public function show(Appointment $appointment): JsonResponse
    {
        $appointment->load(['pet.client', 'veterinarian', 'services']);

        return $this->success(AppointmentResource::make($appointment), 'Detalle de cita.');
    }

    public function update(UpdateAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $appointment = $this->appointmentService->update($appointment, $request->validated());

        return $this->success(AppointmentResource::make($appointment), 'Cita actualizada correctamente.');
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        $appointment->services()->detach();
        $appointment->delete();

        return $this->success(null, 'Cita eliminada correctamente.');
    }
}
