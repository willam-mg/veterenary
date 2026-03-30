<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Cashier;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login_successfully()
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/auth/login/admin', [
            'email' => 'admin@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);

        $data = $response->json('data'); // <- esto decodifica el JSON automáticamente

        $this->assertArrayHasKey('user', $data);
        $this->assertArrayHasKey('token', $data);

        $this->assertEquals($user->id, $data['user']['id']);
        $this->assertIsString($data['token']);
    }

    public function test_admin_login_fails_with_invalid_password()
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => bcrypt('correct-password'),
        ]);

        $response = $this->postJson('/api/auth/login/admin', [
            'email' => 'admin@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['message']);
    }

    public function test_admin_login_fails_with_missing_fields()
    {
        $response = $this->postJson('/api/auth/login/admin', []);

        $response->assertStatus(422)
            ->assertJsonStructure(['message']);
    }

    public function test_cashier_can_login_successfully()
    {
        $user = User::factory()->create([
            'email' => 'cashier@example.com',
            'password' => bcrypt('password123'),
        ]);

        $admin = Cashier::factory()->create([
            'user_id' => $user->id,
            'name' => 'Cashier Test',
        ]);

        $response = $this->postJson('/api/auth/login/cashier', [
            'email' => 'cashier@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);

        $data = $response->json('data'); // <- esto decodifica el JSON automáticamente

        $this->assertArrayHasKey('user', $data);
        $this->assertArrayHasKey('cashier', $data);
        $this->assertArrayHasKey('token', $data);

        $this->assertEquals($user->id, $data['user']['id']);
        $this->assertEquals($admin->id, $data['cashier']['id']);
        $this->assertIsString($data['token']);
    }

    public function test_cashier_login_fails_with_invalid_password()
    {
        User::factory()->create([
            'email' => 'cashier@example.com',
            'password' => bcrypt('correct-password'),
        ]);

        $response = $this->postJson('/api/auth/login/cashier', [
            'email' => 'cashier@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['message']);
    }

    public function test_cashier_login_fails_with_missing_fields()
    {
        $response = $this->postJson('/api/auth/login/cashier', []);

        $response->assertStatus(422)
            ->assertJsonStructure(['message']);
    }
}
