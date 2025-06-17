<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\AIProvider;
use App\Models\UserAIProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class AIProviderTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $provider;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create test user
        $this->user = User::factory()->create();
        
        // Create test AI provider
        $this->provider = AIProvider::create([
            'name' => 'test_provider',
            'display_name' => 'Test Provider',
            'description' => 'Test AI provider for testing',
            'api_base_url' => 'https://api.test.com/v1',
            'is_active' => true,
            'is_free' => true,
        ]);
    }

    public function test_can_get_providers()
    {
        Sanctum::actingAs($this->user);

        $response = $this->getJson('/api/ai-providers/provider');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'name',
                                'display_name',
                                'description',
                                'api_base_url',
                                'is_active',
                                'is_free'
                            ]
                        ]
                    ],
                    'message'
                ]);
    }

    public function test_can_configure_provider()
    {
        Sanctum::actingAs($this->user);

        $response = $this->postJson('/api/ai-providers/provider/configure', [
            'provider_id' => $this->provider->id,
            'api_key' => 'test-api-key-123'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'user_provider' => [
                            'id',
                            'user_id',
                            'provider_id',
                            'is_active',
                            'test_status'
                        ]
                    ],
                    'message'
                ]);

        // Verify user provider was created
        $this->assertDatabaseHas('user_ai_providers', [
            'user_id' => $this->user->id,
            'provider_id' => $this->provider->id,
            'is_active' => true
        ]);
    }

    public function test_can_get_user_providers()
    {
        Sanctum::actingAs($this->user);

        // Create a user provider first
        UserAIProvider::create([
            'user_id' => $this->user->id,
            'provider_id' => $this->provider->id,
            'api_key' => 'test-key',
            'is_active' => true,
            'test_status' => 'success'
        ]);

        $response = $this->getJson('/api/ai-providers/user-providers');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'data' => [
                            '*' => [
                                'id',
                                'user_id',
                                'provider_id',
                                'is_active',
                                'test_status',
                                'provider'
                            ]
                        ]
                    ],
                    'message'
                ]);
    }

    public function test_validation_errors_for_configure_provider()
    {
        Sanctum::actingAs($this->user);

        // Test missing provider_id
        $response = $this->postJson('/api/ai-providers/provider/configure', [
            'api_key' => 'test-key'
        ]);
        $response->assertStatus(422);

        // Test missing api_key
        $response = $this->postJson('/api/ai-providers/provider/configure', [
            'provider_id' => $this->provider->id
        ]);
        $response->assertStatus(422);

        // Test invalid provider_id
        $response = $this->postJson('/api/ai-providers/provider/configure', [
            'provider_id' => 99999,
            'api_key' => 'test-key'
        ]);
        $response->assertStatus(422);
    }

    public function test_requires_authentication()
    {
        // Test without authentication
        $response = $this->getJson('/api/ai-providers/provider');
        $response->assertStatus(401);

        $response = $this->postJson('/api/ai-providers/provider/configure', [
            'provider_id' => $this->provider->id,
            'api_key' => 'test-key'
        ]);
        $response->assertStatus(401);
    }
}
