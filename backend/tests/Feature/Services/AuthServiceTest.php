<?php

namespace Tests\Feature\Services;

use App\Models\Admin;
use App\Models\Cashier;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Dotenv\Exception\ValidationException;

class AuthServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_admin()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);

        $admin = Admin::factory()->create([
            'name' => 'John Doe',
            'user_id' => $user->id
        ]);

        $authService = new AuthService();

        $response = $authService->loginAdmin('test@example.com', 'password123');

        $this->assertArrayHasKey('user', $response);
        $this->assertArrayHasKey('token', $response);
        $this->assertEquals($user->id, $response['user']->id);
        $this->assertEquals($admin->id, $response['admin']->id);
        $this->assertIsString($response['token']);
    }
    
    public function test_login_cashier()
    {
        $user = User::factory()->create([
            'email' => 'testcashier@example.com',
            'password' => bcrypt('password123')
        ]);

        $cashier = Cashier::factory()->create([
            'name' => 'cashier John Doe',
            'phone' => '1234567890',
            'address' => '123 Main St',
            'shift' => 'mañana',
            'photo_src' => '',
            'user_id' => $user->id
        ]);

        $authService = new AuthService();

        $response = $authService->loginCashier('testcashier@example.com', 'password123');

        $this->assertArrayHasKey('user', $response);
        $this->assertArrayHasKey('token', $response);
        $this->assertEquals($user->id, $response['user']->id);
        $this->assertEquals($cashier->id, $response['cashier']->id);
        $this->assertIsString($response['token']);
    }

    public function test_login_admin_with_wrong_password()
    {
        $this->expectException(ValidationException::class);

        User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);

        $authService = new AuthService();
        $authService->loginAdmin('test@example.com', 'wrongpassword');
    }

    public function test_login_admin_with_nonexistent()
    {
        $this->expectException(ValidationException::class);

        $authService = new AuthService();
        $authService->loginAdmin('notfound@example.com', 'password123');
    }
    
    public function test_login_cashier_with_wrong_password()
    {
        $this->expectException(ValidationException::class);

        User::factory()->create([
            'email' => 'testcashier@example.com',
            'password' => bcrypt('password123')
        ]);

        $authService = new AuthService();
        $authService->loginCashier('testcashier@example.com', 'wrongpassword');
    }

    public function test_login_cashier_with_nonexistent()
    {
        $this->expectException(ValidationException::class);

        $authService = new AuthService();
        $authService->loginCashier('notfoundcashier@example.com', 'password123');
    }
}
