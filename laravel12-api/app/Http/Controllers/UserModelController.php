<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserModelService;

class UserModelController extends Controller
{
    protected $userModelService;

    public function __construct(UserModelService $userModelService)
    {
        $this->userModelService = $userModelService;
    }

    public function getUserModels(Request $request)
    {
        $result = $this->userModelService->getUserModels($request->all());

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'User models retrieved successfully'
        ]);
    }

    public function storeUserModel(Request $request)
    {
        $result = $this->userModelService->storeUserModel($request->all());

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'User model stored successfully'
        ]);
    }

    public function updateUserModel(Request $request, $modelId)
    {
        $result = $this->userModelService->updateUserModel($request->all(), $modelId);

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'User model updated successfully'
        ]);
    }

    public function deleteUserModel($modelId)
    {
        $result = $this->userModelService->deleteUserModel($modelId);

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'User model deleted successfully'
        ]);
    }

    public function updateUserModelStatus($modelId, Request $request)
    {
        $result = $this->userModelService->updateUserModelStatus($modelId, $request->all());

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'User model status updated successfully'
        ]);
    }

    public function isDefultUserModel($modelId)
    {
        $result = $this->userModelService->isDefultUserModel($modelId);

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'User model is default successfully'
        ]);
    }

}
