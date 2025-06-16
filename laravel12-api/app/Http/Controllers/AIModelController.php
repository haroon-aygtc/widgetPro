<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\AIModelService;
use App\Services\AIProviderService;

class AIModelController extends Controller
{
    protected $aiModelService;
    protected $aiProviderService;

    public function __construct(AIModelService $aiModelService, AIProviderService $aiProviderService)
    {
        $this->aiModelService = $aiModelService;
        $this->aiProviderService = $aiProviderService;
    }

    public function getProviders(Request $request)
    {
        $result = $this->aiProviderService->getProviders($request->all(), 15);

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'],
            'message' => $result['message'],
            'pagination' => $result['pagination']
        ]);
    }

    public function fetchModels(Request $request, $providerId)
    {
        $result = $this->aiModelService->fetchModels($request->all(), 15, $providerId);

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'],
            'message' => $result['message'],
            'pagination' => $result['pagination']
        ]);
    }

    public function storeModels(Request $request)
    {
        $result = $this->aiModelService->storeModels($request->all());

        return response()->json([
            'success' => $result['success'],
            'data' => $result['data'],
            'message' => $result['message']
        ]);
    }
}
