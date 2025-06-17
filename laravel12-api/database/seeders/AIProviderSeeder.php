<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AIProviderSeeder extends Seeder
{
    public function run(): void
    {
        $providers = [
            [
                'name' => 'openai',
                'display_name' => 'OpenAI',
                'description' => 'Advanced AI models including GPT-4 and GPT-3.5',
                'api_base_url' => 'https://api.openai.com/v1',
                'is_active' => true,
                'is_free' => false,
                'logo_url' => 'https://openai.com/favicon.ico',
                'documentation_url' => 'https://platform.openai.com/docs'
            ],
            [
                'name' => 'anthropic',
                'display_name' => 'Anthropic',
                'description' => 'Claude AI models for safe and helpful conversations',
                'api_base_url' => 'https://api.anthropic.com',
                'is_active' => true,
                'is_free' => false,
                'logo_url' => 'https://www.anthropic.com/favicon.ico',
                'documentation_url' => 'https://docs.anthropic.com'
            ],
            [
                'name' => 'huggingface',
                'display_name' => 'Hugging Face',
                'description' => 'Open source AI models and inference API',
                'api_base_url' => 'https://api-inference.huggingface.co',
                'is_active' => true,
                'logo_url' => 'https://huggingface.co/favicon.ico',
                'documentation_url' => 'https://huggingface.co/docs'
            ],
            [
                'name' => 'openrouter',
                'display_name' => 'OpenRouter',
                'description' => 'Access to multiple AI models through one API',
                'api_base_url' => 'https://openrouter.ai/api/v1',
                'is_active' => true,
                'logo_url' => 'https://openrouter.ai/favicon.ico',
                'documentation_url' => 'https://openrouter.ai/docs'
            ],
            [
                'name' => 'mistral',
                'display_name' => 'Mistral AI',
                'description' => 'Efficient and powerful open-weight models',
                'api_base_url' => 'https://api.mistral.ai/v1',
                'is_active' => true,
                'is_free' => false,
                'logo_url' => 'https://mistral.ai/favicon.ico',
                'documentation_url' => 'https://docs.mistral.ai'
            ],
            [
                'name' => 'groq',
                'display_name' => 'Groq',
                'description' => 'Ultra-fast AI inference with LPU technology',
                'api_base_url' => 'https://api.groq.com/openai/v1',
                'is_active' => true,
                'is_free' => true,
                'logo_url' => 'https://groq.com/favicon.ico',
                'documentation_url' => 'https://console.groq.com/docs'
            ],
            [
                'name' => 'google',
                'display_name' => 'Google AI',
                'description' => 'Gemini models for multimodal AI capabilities',
                'api_base_url' => 'https://generativelanguage.googleapis.com/v1',
                'is_active' => true,
                'is_free' => true,
                'logo_url' => 'https://ai.google/favicon.ico',
                'documentation_url' => 'https://ai.google.dev/docs'
            ],
            [
                'name' => 'cohere',
                'display_name' => 'Cohere',
                'description' => 'Enterprise-grade language models',
                'api_base_url' => 'https://api.cohere.ai/v1',
                'is_active' => true,
                'is_free' => false,
                'logo_url' => 'https://cohere.com/favicon.ico',
                'documentation_url' => 'https://docs.cohere.com'
            ],
            [
                'name' => 'together',
                'display_name' => 'Together AI',
                'description' => 'Open source models with fast inference',
                'api_base_url' => 'https://api.together.xyz/v1',
                'is_active' => true,
                'is_free' => false,
                'logo_url' => 'https://together.ai/favicon.ico',
                'documentation_url' => 'https://docs.together.ai'
            ],
            [
                'name' => 'replicate',
                'display_name' => 'Replicate',
                'description' => 'Run open-source models with cloud API',
                'api_base_url' => 'https://api.replicate.com/v1',
                'is_active' => true,
                'is_free' => false,
                'logo_url' => 'https://replicate.com/favicon.ico',
                'documentation_url' => 'https://replicate.com/docs'
            ]
        ];

        foreach ($providers as $provider) {
            DB::table('ai_providers')->insert(array_merge($provider, [
                'created_at' => now(),
                'updated_at' => now()
            ]));
        }
    }
}
