<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\FetchModels;
use App\Models\AIProvider;
use Illuminate\Support\Facades\Http;

class AIModelService
{
    public function fetchModels(AIProvider $provider, string $apiKey): array
    {
        return $this->fetchModelsFromProvider($provider, $apiKey);
    }

    public function storeModels(array $data)
    {
        return DB::transaction(function () use ($data) {
            $model = AIModel::create($data);
            $model->load('provider');

            return [
                'success' => true,
                'data' => $model,
                'message' => 'Model stored successfully'
            ];
        });
    }

    private function fetchModelsFromProvider(AIProvider $provider, string $apiKey): array
    {
        switch ($provider->name) {
            case 'openai':
                return $this->fetchOpenAIModels($apiKey);
            case 'anthropic':
                return $this->fetchAnthropicModels($apiKey);
            case 'groq':
                return $this->fetchGroqModels($apiKey);
            case 'google':
                return $this->fetchGoogleModels($apiKey);
            case 'huggingface':
                return $this->fetchHuggingFaceModels($apiKey);
            default:
                return $this->fetchGenericModels($provider, $apiKey);
        }
    }

    private function fetchOpenAIModels(string $apiKey): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json'
        ])->get('https://api.openai.com/v1/models');

        if (!$response->successful()) {
            throw new \Exception('Failed to fetch OpenAI models: ' . $response->body());
        }

        $models = [];
        foreach ($response->json('data', []) as $model) {
            if (str_contains($model['id'], 'gpt')) {
                $models[] = [
                    'name' => $model['id'],
                    'display_name' => ucfirst(str_replace('-', ' ', $model['id'])),
                    'description' => 'OpenAI ' . $model['id'] . ' model',
                    'is_free' => false
                ];
            }
        }

        return $models;
    }

    private function fetchAnthropicModels(string $apiKey): array
    {
        // Anthropic doesn't have a models endpoint, return known models
        return [
            [
                'name' => 'claude-3-opus-20240229',
                'display_name' => 'Claude 3 Opus',
                'description' => 'Most powerful Claude model',
                'is_free' => false
            ],
            [
                'name' => 'claude-3-sonnet-20240229',
                'display_name' => 'Claude 3 Sonnet',
                'description' => 'Balanced performance and cost',
                'is_free' => false
            ],
            [
                'name' => 'claude-3-haiku-20240307',
                'display_name' => 'Claude 3 Haiku',
                'description' => 'Fast and efficient',
                'is_free' => false
            ]
        ];
    }

    private function fetchGroqModels(string $apiKey): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json'
        ])->get('https://api.groq.com/openai/v1/models');

        if (!$response->successful()) {
            throw new \Exception('Failed to fetch Groq models: ' . $response->body());
        }

        $models = [];
        foreach ($response->json('data', []) as $model) {
            $models[] = [
                'name' => $model['id'],
                'display_name' => ucfirst(str_replace('-', ' ', $model['id'])),
                'description' => 'Groq ' . $model['id'] . ' model',
                'is_free' => true
            ];
        }

        return $models;
    }

    private function fetchGoogleModels(string $apiKey): array
    {
        return [
            [
                'name' => 'gemini-pro',
                'display_name' => 'Gemini Pro',
                'description' => 'Advanced reasoning and understanding',
                'is_free' => true
            ],
            [
                'name' => 'gemini-pro-vision',
                'display_name' => 'Gemini Pro Vision',
                'description' => 'Multimodal model with vision capabilities',
                'is_free' => true
            ]
        ];
    }

    private function fetchHuggingFaceModels(string $apiKey): array
    {
        return [
            [
                'name' => 'microsoft/DialoGPT-medium',
                'display_name' => 'DialoGPT Medium',
                'description' => 'Conversational AI model',
                'is_free' => true
            ],
            [
                'name' => 'facebook/blenderbot-400M-distill',
                'display_name' => 'BlenderBot 400M',
                'description' => 'Open-domain chatbot',
                'is_free' => true
            ]
        ];
    }

    private function fetchGenericModels(AIProvider $provider, string $apiKey): array
    {
        // Return default models for unknown providers
        return [
            [
                'name' => 'default-model',
                'display_name' => 'Default Model',
                'description' => 'Default model for ' . $provider->display_name,
                'is_free' => true,
                'max_tokens' => null,
                'context_window' => null,
                'pricing_input' => null,
                'pricing_output' => null
            ]
        ];
    }

    private function getModelPricing(string $modelId, array $pricingData): array
    {
        foreach ($pricingData as $pattern => $pricing) {
            if (str_contains($modelId, $pattern)) {
                return $pricing;
            }
        }
        return [];
    }
}