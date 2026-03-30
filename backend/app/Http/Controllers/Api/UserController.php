<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class UserController extends ApiController
{
    public function index(): JsonResponse
    {
        return $this->success(UserResource::collection(User::query()->latest()->get()), 'Listado de usuarios.');
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $payload = $request->validated();
        $user = User::create($payload);

        return $this->success(UserResource::make($user), 'Usuario creado correctamente.', Response::HTTP_CREATED);
    }

    public function show(User $user): JsonResponse
    {
        return $this->success(UserResource::make($user), 'Detalle de usuario.');
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $payload = $request->validated();

        if (blank($payload['password'] ?? null)) {
            unset($payload['password']);
        }

        $user->update($payload);

        return $this->success(UserResource::make($user), 'Usuario actualizado correctamente.');
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return $this->success(null, 'Usuario eliminado correctamente.');
    }
}
