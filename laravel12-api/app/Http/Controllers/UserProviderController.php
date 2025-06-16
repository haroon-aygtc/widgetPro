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
        'success' => $result['success'],
        'data' => $result['data'],
        'message' => $result['message']
    ]);
    }
    public function configureProvider(Request $request)
    {
        $result = $this->userProviderService->storeUserProvider($request->all());

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'],
            'message' => $result['message']
        ]);
    }

    public function updateUserProviderStatus(Request $request)
    {
        $result = $this->userProviderService->updateUserProviderStatus($request->all());

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'],
            'message' => $result['message']
        ]);
    }

    public function deleteUserProvider($providerId)
    {
        $result = $this->userProviderService->deleteUserProvider($providerId);

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'],
            'message' => $result['message']
        ]);
    }
}