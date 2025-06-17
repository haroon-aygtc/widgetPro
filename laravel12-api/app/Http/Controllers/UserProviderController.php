<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserProviderService;

class UserProviderController extends Controller
{
    protected $userProviderService;

    public function __construct(UserProviderService $userProviderService)
    {
        $this->userProviderService = $userProviderService;
    }

    public function getUserProvider(Request $request)
    {
        $result = $this->userProviderService->getUserProvider($request->all());

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'User providers retrieved successfully'
        ]);
    }
    public function configureProvider(Request $request)
    {
        // Validate request
        $request->validate([
            'provider_id' => 'required|integer|exists:ai_providers,id',
            'api_key' => 'required|string'
        ]);

        $result = $this->userProviderService->configureProviderWithModels($request->all());

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'Provider configured successfully'
        ]);
    }

    public function updateUserProviderStatus(Request $request)
    {
        $result = $this->userProviderService->updateUserProviderStatus($request->all());

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'Provider status updated successfully'
        ]);
    }

    public function deleteUserProvider($providerId)
    {
        $result = $this->userProviderService->deleteUserProvider($providerId);

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'Provider deleted successfully'
        ]);
    }
}
