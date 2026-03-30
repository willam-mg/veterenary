<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaveUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserManagementService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    public function __construct(private UserManagementService $userManagementService)
    {
    }

    public function index(Request $request)
    {
        $collection = UserResource::collection($this->userManagementService->list($request->all()))->response()->getData(true);

        return response()->json([
            'message' => 'Success',
            'data' => $collection['data'],
            'meta' => $collection['meta'] ?? null,
            'links' => $collection['links'] ?? null,
        ], Response::HTTP_OK);
    }

    public function store(SaveUserRequest $request)
    {
        return response()->json([
            'message' => 'Created Successfully',
            'data' => $this->userManagementService->create($request->validated()),
        ], Response::HTTP_CREATED);
    }

    public function show(int $id)
    {
        return response()->json([
            'message' => 'Success',
            'data' => UserResource::make($this->userManagementService->find($id)),
        ], Response::HTTP_OK);
    }

    public function update(SaveUserRequest $request, int $id)
    {
        return response()->json([
            'message' => 'Updated Successfully',
            'data' => $this->userManagementService->update($id, $request->validated()),
        ], Response::HTTP_OK);
    }

    public function destroy(int $id)
    {
        $this->userManagementService->delete($id);

        return response()->json([
            'message' => 'Deleted Successfully',
        ], Response::HTTP_OK);
    }
}
