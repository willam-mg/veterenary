<?php

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Pet;
use App\Models\User;
use App\Models\Veterinarian;
use App\Models\VeterinaryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AppointmentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_appointment_with_services(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $pet = Pet::factory()->for(Client::factory())->create();
        $veterinarian = Veterinarian::factory()->create();
        $service = VeterinaryService::factory()->create([
            'name' => 'Consulta general',
            'slug' => 'consulta-general-test',
            'price' => 80,
        ]);

        $response = $this->postJson('/api/v1/appointments', [
            'pet_id' => $pet->id,
            'veterinarian_id' => $veterinarian->id,
            'scheduled_at' => '2026-04-10 09:00:00',
            'reason' => 'Chequeo anual',
            'status' => 'scheduled',
            'services' => [
                ['id' => $service->id, 'quantity' => 2],
            ],
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.services.0.id', $service->id)
            ->assertJsonPath('data.services.0.quantity', 2);
    }
}
