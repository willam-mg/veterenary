<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\InventoryLoginRequest;
use App\Services\AuthService;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function __construct(private AuthService $authService) {}

    /**
     * Display a listing of the resource.
     */
    public function loginAdmin(Request $request)
    {
        try {
            $rules = [
                'email'    => 'required|email',
                'password' => 'required'
            ];

            $this->validatorMake($request->all(), $rules);
            
            $loginResponse = $this->authService->loginAdmin($request->email, $request->password);

            return response()->json([
                'message' => 'Success',
                'data' => $loginResponse
            ], Response::HTTP_OK);
        } catch (ValidationException $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 422);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }
    
    public function loginCashier(Request $request)
    {
        try {
            $rules = [
                'email'    => 'required|email',
                'password' => 'required'
            ];

            $this->validatorMake($request->all(), $rules);
    
            $loginResponse = $this->authService->loginCashier($request->email, $request->password);

            return response()->json([
                'message' => 'Success',
                'data' => $loginResponse
            ], Response::HTTP_OK);
        } catch (ValidationException $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 422);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function login(InventoryLoginRequest $request)
    {
        try {
            $loginResponse = $this->authService->loginInventory(
                $request->validated('email'),
                $request->validated('password'),
            );

            return response()->json([
                'message' => 'Success',
                'data' => $loginResponse
            ], Response::HTTP_OK);
        } catch (ValidationException $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => $th->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function logout()
    {
        try {
            auth()->guard()->logout();
            return response()->json([
                "message" => "Usuario session finalizado"
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                "message" => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
