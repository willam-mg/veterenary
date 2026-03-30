<?php
namespace App\Services;

use App\Models\Admin;
use App\Models\Cashier;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    private function login($email, $password)
    {
        try {
            $user = User::where('email', $email)
                ->where('deleted_at', null)
                ->where('is_active', true)
                ->first();
        
            if (!$user || !Hash::check($password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['Credenciales incorrectas.'],
                ]);
            }

            $token = $user->createToken('api_token')->plainTextToken;

            return [
                'user' => $user,
                'token' => $token
            ];
        } catch (ValidationException $th) {
            throw $th;
        }
    }

    public function loginInventory(string $email, string $password): array
    {
        $login = $this->login($email, $password);
        $user = $login['user']->load(['branch', 'managedPointsOfSale']);

        return [
            'user' => $user,
            'token' => $login['token']
        ];
    }

    private function getTypeUser($typeUser, $userId): mixed 
    {
        switch ($typeUser) {
            case 'admin':
                return Admin::where('user_id', $userId)->firstOrFail();
            case 'cashier':
                return Cashier::where('user_id', $userId)->firstOrFail();
            default:
                return null;
        }
    }

    public function loginAdmin($email, $password)
    {
        try {
            $login = $this->login($email, $password, 'admin');
            $user = $login['user'];
            
            return [
                'user' => $user,
                'admin' => $this->getTypeUser('admin', $user->id),
                'token' => $login['token']
            ];
        } catch (ValidationException $th) {
            throw $th;
        }
    }
    
    public function loginCashier($email, $password)
    {
        try {
            $login = $this->login($email, $password, 'admin');
            $user = $login['user'];

            return [
                'user' => $user,
                'cashier' => $this->getTypeUser('cashier', $user->id),
                'token' => $login['token']
            ];
        } catch (ValidationException $th) {
            throw $th;
        }
    }
}
