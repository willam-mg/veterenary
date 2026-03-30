<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ClientApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_client(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/v1/clients', [
            'first_name' => 'Laura',
            'last_name' => 'Soto',
            'email' => 'laura@example.com',
            'phone' => '71010001',
            'document_number' => 'CI-9001',
            'address' => 'Zona Sur',
            'notes' => 'Caso para QA.',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.full_name', 'Laura Soto');
    }
}
