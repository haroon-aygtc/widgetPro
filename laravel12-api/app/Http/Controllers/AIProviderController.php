<?php

namespace App\Http\Controllers;

use App\Models\AIProvider;
use App\Models\AIModel;
use App\Models\UserAIProvider;
use App\Models\UserAIModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Services\AIProviderService;

class AIProviderController extends Controller
{
    protected $aiProviderService;

    public function __construct(AIProviderService $aiProviderService)
    {
        $this->aiProviderService = $aiProviderService;
    }

    public function getProviders(Request $request): JsonResponse
    {
        $result = $this->aiProviderService->getProviders($request->all(), 15);

        return response()->json([
            'success' => $result['success'] ?? true ,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'Providers retrieved successfully',
            'pagination' => $result['pagination'] ?? $result
        ]);
    }

    public function testProvider(Request $request)
    {
        $result = $this->aiProviderService->testProvider($request->provider_id, $request->api_key);

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'Provider tested successfully'
        ]);
    }

    public function fetchModelsForProvider(Request $request, $providerId)
    {
        $result = $this->aiProviderService->fetchModels($request->all(), 15, $providerId);

        return response()->json([
            'success' => $result['success'] ?? true,
            'data' => $result['data'] ?? $result,
            'message' => $result['message'] ?? 'Models retrieved successfully'
        ]);
    }




}
