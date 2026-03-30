<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\Client;
use App\Models\ClinicalRecord;
use App\Models\Pet;
use App\Models\Veterinarian;
use Illuminate\Http\JsonResponse;

class DashboardController extends ApiController
{
    public function index(): JsonResponse
    {
        return $this->success([
            'clients_count' => Client::query()->count(),
            'pets_count' => Pet::query()->count(),
            'veterinarians_count' => Veterinarian::query()->count(),
            'appointments_count' => Appointment::query()->count(),
            'pending_appointments_count' => Appointment::query()
                ->whereIn('status', [Appointment::STATUS_SCHEDULED, Appointment::STATUS_CONFIRMED])
                ->count(),
            'clinical_records_count' => ClinicalRecord::query()->count(),
            'next_appointments' => AppointmentResource::collection(
                Appointment::query()
                    ->with(['pet.client', 'veterinarian', 'services'])
                    ->orderBy('scheduled_at')
                    ->limit(5)
                    ->get()
            ),
        ], 'Resumen del dashboard.');
    }
}
