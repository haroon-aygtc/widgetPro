<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\FetchModels;
use App\Models\AIProvider;
use Illuminate\Support\Facades\Http;
use App\Models\UserAIModel;
use Illuminate\Support\Facades\Auth;

class AIModelService
{
    public function validateApiKey(AIProvider $provider, string $apiKey): array
    {
        try {
            return $this->testApiKeyWithProvider($provider, $apiKey);
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'API key validation failed: ' . $e->getMessage()
            ];
        }
    }

    public function fetchModels(AIProvider $provider, string $apiKey): array
    {
        try {
            $models = $this->fetchModelsFromProvider($provider, $apiKey);

            // Store models in ai_models table if they don't exist
            foreach ($models as &$modelData) {
                $existingModel = \App\Models\AIModel::where('provider_id', $provider->id)
                    ->where('name', $modelData['name'])
                    ->first();

                if (!$existingModel) {
                    $existingModel = \App\Models\AIModel::create([
                        'provider_id' => $provider->id,
                        'name' => $modelData['name'],
                        'display_name' => $modelData['display_name'],
                        'description' => $modelData['description'] ?? null,
                        'is_free' => $modelData['is_free'] ?? false,
                        'max_tokens' => $modelData['max_tokens'] ?? null,
                        'context_window' => $modelData['context_window'] ?? null,
                        'pricing_input' => $modelData['pricing_input'] ?? null,
                        'pricing_output' => $modelData['pricing_output'] ?? null,
                        'is_active' => true
                    ]);
                }

                // Add the database ID to the model data
                $modelData['id'] = $existingModel->id;
                $modelData['provider'] = $provider;
            }

            return $models;
        } catch (\Exception $e) {
            throw new \Exception('Failed to fetch models: ' . $e->getMessage());
        }
    }

    public function storeModels(array $data)
    {
        return DB::transaction(function () use ($data) {
            $model = UserAIModel::create(
                [
                    'user_id' => Auth::id(),
                    'user_provider_id' => $data['user_provider_id'],
                    'custom_name' => $data['custom_name'],
                    'is_active' => true,
                    'is_default' => false,
                ]
            );

            return [
                'success' => true,
                'data' => $model
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
                'is_free' => $provider->is_free
            ]
        ];
    }

    private function testApiKeyWithProvider(AIProvider $provider, string $apiKey): array
    {
        switch ($provider->name) {
            case 'openai':
                return $this->testOpenAIApiKey($apiKey);
            case 'anthropic':
                return $this->testAnthropicApiKey($apiKey);
            case 'groq':
                return $this->testGroqApiKey($apiKey);
            case 'google':
                return $this->testGoogleApiKey($apiKey);
            case 'huggingface':
                return $this->testHuggingFaceApiKey($apiKey);
            default:
                return $this->testGenericApiKey($provider, $apiKey);
        }
    }

    private function testOpenAIApiKey(string $apiKey): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json'
        ])->get('https://api.openai.com/v1/models', ['limit' => 1]);

        if (!$response->successful()) {
            throw new \Exception('Invalid OpenAI API key');
        }

        return [
            'success' => true,
            'message' => 'OpenAI API key is valid'
        ];
    }

    private function testAnthropicApiKey(string $apiKey): array
    {
        // Anthropic doesn't have a simple test endpoint, so we'll assume it's valid if it's formatted correctly
        if (empty($apiKey) || !str_starts_with($apiKey, 'sk-ant-')) {
            throw new \Exception('Invalid Anthropic API key format');
        }

        return [
            'success' => true,
            'message' => 'Anthropic API key format is valid'
        ];
    }

    private function testGroqApiKey(string $apiKey): array
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json'
        ])->get('https://api.groq.com/openai/v1/models', ['limit' => 1]);

        if (!$response->successful()) {
            throw new \Exception('Invalid Groq API key');
        }

        return [
            'success' => true,
            'message' => 'Groq API key is valid'
        ];
    }

    private function testGoogleApiKey(string $apiKey): array
    {
        // Google AI uses a different format, basic validation
        if (empty($apiKey)) {
            throw new \Exception('Google AI API key cannot be empty');
        }

        return [
            'success' => true,
            'message' => 'Google AI API key format is valid'
        ];
    }

    private function testHuggingFaceApiKey(string $apiKey): array
    {
        // HuggingFace API key validation
        if (empty($apiKey)) {
            throw new \Exception('HuggingFace API key cannot be empty');
        }

        return [
            'success' => true,
            'message' => 'HuggingFace API key format is valid'
        ];
    }

    private function testGenericApiKey(AIProvider $provider, string $apiKey): array
    {
        if (empty($apiKey)) {
            throw new \Exception($provider->display_name . ' API key cannot be empty');
        }

        return [
            'success' => true,
            'message' => $provider->display_name . ' API key format is valid'
        ];
    }
}
