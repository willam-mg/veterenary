<?php

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserManagementService
{
    public function list(array $filters = []): LengthAwarePaginator
    {
        return User::query()
            ->with(['branch', 'managedPointsOfSale'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($filters['role'] ?? null, fn ($query, $role) => $query->where('role', $role))
            ->when($filters['branch_id'] ?? null, fn ($query, $branchId) => $query->where('branch_id', $branchId))
            ->orderBy('name')
            ->paginate((int) ($filters['per_page'] ?? 10))
            ->withQueryString();
    }

    public function find(int $id): User
    {
        return User::query()->with(['branch', 'managedPointsOfSale'])->findOrFail($id);
    }

    public function create(array $data): UserResource
    {
        return DB::transaction(function () use ($data) {
            $pointOfSaleIds = $data['point_of_sale_ids'] ?? [];
            unset($data['point_of_sale_ids']);

            $user = User::create([
                ...$data,
                'password' => Hash::make($data['password']),
            ]);

            $user->managedPointsOfSale()->sync($pointOfSaleIds);

            return UserResource::make($user->load(['branch', 'managedPointsOfSale']));
        });
    }

    public function update(int $id, array $data): UserResource
    {
        return DB::transaction(function () use ($id, $data) {
            $pointOfSaleIds = $data['point_of_sale_ids'] ?? null;
            unset($data['point_of_sale_ids']);

            if (empty($data['password'])) {
                unset($data['password']);
            } else {
                $data['password'] = Hash::make($data['password']);
            }

            $user = User::findOrFail($id);
            $user->update($data);

            if ($pointOfSaleIds !== null) {
                $user->managedPointsOfSale()->sync($pointOfSaleIds);
            }

            return UserResource::make($user->fresh()->load(['branch', 'managedPointsOfSale']));
        });
    }

    public function delete(int $id): void
    {
        DB::transaction(fn () => User::findOrFail($id)->delete());
    }
}
