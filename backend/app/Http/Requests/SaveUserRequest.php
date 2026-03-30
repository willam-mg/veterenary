<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SaveUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('id');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($userId)],
            'password' => [$userId ? 'nullable' : 'required', 'string', 'min:6'],
            'role' => ['required', Rule::in([
                User::ROLE_ADMIN,
                User::ROLE_BRANCH_MANAGER,
                User::ROLE_SELLER,
                User::ROLE_CASHIER,
            ])],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'is_active' => ['nullable', 'boolean'],
            'point_of_sale_ids' => ['nullable', 'array'],
            'point_of_sale_ids.*' => ['integer', 'exists:point_of_sales,id'],
        ];
    }
}

