<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_ai_providers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('provider_id')->constrained('ai_providers')->onDelete('cascade');
            $table->text('api_key');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_tested_at')->nullable();
            $table->enum('test_status', ['success', 'failed', 'pending'])->nullable();
            $table->text('test_message')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'provider_id']);
            $table->index(['user_id']);
            $table->index(['provider_id']);
            $table->index(['is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_ai_providers');
    }
};
