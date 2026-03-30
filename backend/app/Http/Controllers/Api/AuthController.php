<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends ApiController
{
    public function __construct(private readonly AuthService $authService)
    {
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $authData = $this->authService->register($request->validated());

        return $this->success([
            'user' => UserResource::make($authData['user']),
            'token' => $authData['token'],
        ], 'Usuario registrado correctamente.', Response::HTTP_CREATED);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $authData = $this->authService->login($request->validated());

        return $this->success([
            'user' => UserResource::make($authData['user']),
            'token' => $authData['token'],
        ], 'Inicio de sesión exitoso.');
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success(UserResource::make($request->user()), 'Perfil autenticado.');
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return $this->success(null, 'Sesión cerrada correctamente.');
    }
}
