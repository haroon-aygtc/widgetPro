<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AIModelService;
use App\Services\AIProviderService;
use App\Services\UserModelService;

class AIModelController extends Controller
{
    protected $aiModelService;
    protected $aiProviderService;
    protected $userModelService;

    public function __construct(AIModelService $aiModelService, AIProviderService $aiProviderService, UserModelService $userModelService)
    {
        $this->aiModelService = $aiModelService;
        $this->aiProviderService = $aiProviderService;
        $this->userModelService = $userModelService;
    }

    public function getProviders(Request $request)
    {
        $result = $this->aiProviderService->getProviders($request->all(), 15);

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'Providers retrieved successfully',
            'pagination' => $result['pagination'] ?? $result
        ]);
    }

    public function fetchModels(Request $request, $providerId)
    {
        $result = $this->aiModelService->fetchModels($request->all(), 15, $providerId);

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'Models retrieved successfully',
            'pagination' => $result['pagination'] ?? $result
        ]);
    }

    public function storeModels(Request $request)
    {
        $result = $this->aiModelService->storeModels($request->all());

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'Models stored successfully'
        ]);
    }
}
