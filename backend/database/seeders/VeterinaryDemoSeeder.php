<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Client;
use App\Models\ClinicalRecord;
use App\Models\Pet;
use App\Models\User;
use App\Models\Veterinarian;
use App\Models\VeterinaryService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class VeterinaryDemoSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@vetdemo.test'],
            [
                'name' => 'Administrador Demo',
                'phone' => '70000001',
                'role' => User::ROLE_ADMIN,
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );

        $receptionist = User::query()->updateOrCreate(
            ['email' => 'recepcion@vetdemo.test'],
            [
                'name' => 'Recepcion Demo',
                'phone' => '70000002',
                'role' => User::ROLE_RECEPTIONIST,
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );

        $vets = collect([
            [
                'first_name' => 'Ana',
                'last_name' => 'Mendoza',
                'email' => 'ana.mendoza@vetdemo.test',
                'phone' => '70100001',
                'license_number' => 'COL-VET-1001',
                'specialty' => 'Medicina general',
            ],
            [
                'first_name' => 'Luis',
                'last_name' => 'Rojas',
                'email' => 'luis.rojas@vetdemo.test',
                'phone' => '70100002',
                'license_number' => 'COL-VET-1002',
                'specialty' => 'Cirugia',
            ],
        ])->map(fn (array $payload) => Veterinarian::query()->updateOrCreate(
            ['license_number' => $payload['license_number']],
            $payload + ['is_active' => true]
        ));

        $services = collect([
            ['name' => 'Consulta general', 'price' => 80, 'duration_minutes' => 30],
            ['name' => 'Vacunacion anual', 'price' => 120, 'duration_minutes' => 20],
            ['name' => 'Desparasitacion', 'price' => 60, 'duration_minutes' => 15],
        ])->map(fn (array $payload) => VeterinaryService::query()->updateOrCreate(
            ['slug' => Str::slug($payload['name'])],
            $payload + ['description' => $payload['name'].' para demo', 'is_active' => true]
        ));

        $clients = collect([
            [
                'first_name' => 'Maria',
                'last_name' => 'Lopez',
                'email' => 'maria.lopez@example.com',
                'phone' => '71000001',
                'document_number' => 'CI-1001',
                'address' => 'Av. Siempre Viva 123',
                'notes' => 'Prefiere contacto por WhatsApp.',
            ],
            [
                'first_name' => 'Carlos',
                'last_name' => 'Perez',
                'email' => 'carlos.perez@example.com',
                'phone' => '71000002',
                'document_number' => 'CI-1002',
                'address' => 'Calle Comercio 456',
                'notes' => 'Cliente recurrente.',
            ],
        ])->map(fn (array $payload) => Client::query()->updateOrCreate(
            ['document_number' => $payload['document_number']],
            $payload
        ));

        $pets = collect([
            [
                'client_id' => $clients[0]->id,
                'name' => 'Luna',
                'species' => 'dog',
                'breed' => 'Labrador',
                'sex' => 'female',
                'birth_date' => '2022-06-10',
                'weight' => 18.50,
                'color' => 'Miel',
                'microchip_number' => 'MC-1001',
                'allergies' => 'Ninguna',
                'notes' => 'Muy sociable.',
                'is_active' => true,
            ],
            [
                'client_id' => $clients[1]->id,
                'name' => 'Michi',
                'species' => 'cat',
                'breed' => 'Siames',
                'sex' => 'male',
                'birth_date' => '2021-09-15',
                'weight' => 5.20,
                'color' => 'Crema',
                'microchip_number' => 'MC-1002',
                'allergies' => 'Sensibilidad alimentaria',
                'notes' => 'Se estresa con facilidad.',
                'is_active' => true,
            ],
        ])->map(fn (array $payload) => Pet::query()->updateOrCreate(
            ['microchip_number' => $payload['microchip_number']],
            $payload
        ));

        $appointmentOne = Appointment::query()->updateOrCreate(
            ['pet_id' => $pets[0]->id, 'scheduled_at' => '2026-04-02 10:00:00'],
            [
                'veterinarian_id' => $vets[0]->id,
                'reason' => 'Consulta general',
                'status' => Appointment::STATUS_CONFIRMED,
                'notes' => 'Primera visita demo.',
            ]
        );

        $appointmentTwo = Appointment::query()->updateOrCreate(
            ['pet_id' => $pets[1]->id, 'scheduled_at' => '2026-04-03 16:00:00'],
            [
                'veterinarian_id' => $vets[1]->id,
                'reason' => 'Control dermatologico',
                'status' => Appointment::STATUS_SCHEDULED,
                'notes' => 'Revisar piel y pelaje.',
            ]
        );

        $appointmentOne->services()->sync([
            $services[0]->id => ['quantity' => 1, 'unit_price' => $services[0]->price],
            $services[1]->id => ['quantity' => 1, 'unit_price' => $services[1]->price],
        ]);

        $appointmentTwo->services()->sync([
            $services[0]->id => ['quantity' => 1, 'unit_price' => $services[0]->price],
            $services[2]->id => ['quantity' => 1, 'unit_price' => $services[2]->price],
        ]);

        ClinicalRecord::query()->updateOrCreate(
            ['pet_id' => $pets[0]->id, 'record_date' => '2026-03-20'],
            [
                'veterinarian_id' => $vets[0]->id,
                'appointment_id' => $appointmentOne->id,
                'diagnosis' => 'Paciente en buen estado general.',
                'treatment' => 'Vacunacion y control preventivo.',
                'observations' => 'Continuar con dieta balanceada.',
                'weight' => 18.50,
            ]
        );

        ClinicalRecord::query()->updateOrCreate(
            ['pet_id' => $pets[1]->id, 'record_date' => '2026-03-18'],
            [
                'veterinarian_id' => $vets[1]->id,
                'appointment_id' => $appointmentTwo->id,
                'diagnosis' => 'Dermatitis leve.',
                'treatment' => 'Shampoo dermatologico por 10 dias.',
                'observations' => 'Control en dos semanas.',
                'weight' => 5.20,
            ]
        );

        Client::factory()->count(3)->create()->each(function (Client $client) use ($vets, $services): void {
            $pet = Pet::factory()->for($client)->create();
            $appointment = Appointment::factory()
                ->for($pet)
                ->for($vets->random())
                ->create();
            $service = $services->random();

            $appointment->services()->sync([
                $service->id => ['quantity' => 1, 'unit_price' => $service->price],
            ]);
        });
    }
}
