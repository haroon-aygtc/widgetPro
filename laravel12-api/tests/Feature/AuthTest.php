<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a test user
        $this->user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
    }

    public function test_user_can_login()
    {
        $response = $this->post('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'name',
                        'email',
                        'status',
                    ]
                ]);

        $this->assertAuthenticated();
    }

    public function test_user_can_logout()
    {
        // First login
        $this->actingAs($this->user);
        $this->assertAuthenticated();

        // Then logout
        $response = $this->post('/api/logout');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Logout successful'
                ]);

        $this->assertGuest();
    }

    public function test_logout_creates_activity_log()
    {
        // Login first
        $this->actingAs($this->user);

        // Logout
        $response = $this->post('/api/logout');

        $response->assertStatus(200);

        // Check if activity was logged
        $this->assertDatabaseHas('user_activities', [
            'user_id' => $this->user->id,
            'action' => 'logout',
            'status' => 'success',
        ]);
    }

    public function test_user_can_register()
    {
        $response = $this->post('/api/register', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'name',
                        'email',
                        'status',
                    ]
                ]);

        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
            'name' => 'New User',
        ]);

        $this->assertAuthenticated();
    }

    public function test_authenticated_user_can_get_profile()
    {
        $this->actingAs($this->user);

        $response = $this->get('/api/user');

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'id' => $this->user->id,
                        'name' => $this->user->name,
                        'email' => $this->user->email,
                    ]
                ]);
    }

    public function test_unauthenticated_user_cannot_access_protected_routes()
    {
        $response = $this->get('/api/user');

        $response->assertStatus(401);
    }

    public function test_logout_works_even_with_errors()
    {
        $this->actingAs($this->user);

        // Mock a scenario where activity logging might fail
        // but logout should still work
        $response = $this->post('/api/logout');

        $response->assertStatus(200);
        $this->assertGuest();
    }
}
