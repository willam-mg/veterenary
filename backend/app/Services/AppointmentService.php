<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\VeterinaryService;

class AppointmentService
{
    public function create(array $payload): Appointment
    {
        $appointment = Appointment::create($this->extractAppointmentAttributes($payload));
        $this->syncServices($appointment, $payload['services'] ?? []);

        return $appointment->load(['pet.client', 'veterinarian', 'services']);
    }

    public function update(Appointment $appointment, array $payload): Appointment
    {
        $appointment->update($this->extractAppointmentAttributes($payload));

        if (array_key_exists('services', $payload)) {
            $this->syncServices($appointment, $payload['services'] ?? []);
        }

        return $appointment->load(['pet.client', 'veterinarian', 'services']);
    }

    private function extractAppointmentAttributes(array $payload): array
    {
        return collect($payload)
            ->only(['pet_id', 'veterinarian_id', 'scheduled_at', 'reason', 'status', 'notes'])
            ->all();
    }

    private function syncServices(Appointment $appointment, array $services): void
    {
        $syncData = collect($services)->mapWithKeys(function (array $service): array {
            $catalog = VeterinaryService::query()->findOrFail($service['id']);

            return [
                $catalog->id => [
                    'quantity' => $service['quantity'] ?? 1,
                    'unit_price' => $catalog->price,
                ],
            ];
        })->all();

        $appointment->services()->sync($syncData);
    }
}
