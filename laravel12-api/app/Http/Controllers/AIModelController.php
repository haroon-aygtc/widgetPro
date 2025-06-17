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
        $request->validate([
            'provider_id' => 'required|integer|exists:ai_providers,id',
            'name' => 'required|string',
            'display_name' => 'required|string',
            'description' => 'nullable|string',
            'is_free' => 'boolean',
            'max_tokens' => 'nullable|integer',
            'context_window' => 'nullable|integer',
            'pricing_input' => 'nullable|numeric',
            'pricing_output' => 'nullable|numeric'
        ]);

        try {
            $result = $this->aiModelService->storeModels($request->all());

            return response()->json([
                'success' => $result['success'] ?? true,
                'data' => $result['data'] ?? $result,
                'message' => $result['message'] ?? 'Model stored successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to store model: ' . $e->getMessage()
            ], 500);
        }
    }
}
