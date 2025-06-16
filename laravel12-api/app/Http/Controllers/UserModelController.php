<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserModelController extends Controller
{
    protected $userModelService;

    public function __construct(UserModelService $userModelService)
    {
        $this->userModelService = $userModelService;
    }

    public function getUserModels(Request $request, $providerId)
    {
        $result = $this->userModelService->getUserModels($request->all(), 15, $providerId);

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'],
            'message' => $result['message'],
            'pagination' => $result['pagination']
        ]);
    }

    public function storeUserModel(Request $request)
    {
        $result = $this->userModelService->storeUserModel($request->all());

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'],
            'message' => $result['message']
        ]);
    }

    public function updateUserModel(Request $request, $modelId)
    {
        $result = $this->userModelService->updateUserModel($request->all(), $modelId);

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'],
            'message' => $result['message']
        ]);
    }

    public function deleteUserModel($modelId)
    {
        $result = $this->userModelService->deleteUserModel($modelId);

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'],
            'message' => $result['message']
        ]);
    }

    public function updateUserModelStatus($modelId, Request $request)
    {
        $result = $this->userModelService->updateUserModelStatus($modelId, $request->all());

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'],
            'message' => $result['message']
        ]);
    }

    public function isDefultUserModel($modelId)
    {
        $result = $this->userModelService->isDefultUserModel($modelId);

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'],
            'message' => $result['message']
        ]);
    }

}