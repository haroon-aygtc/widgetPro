<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_ai_models', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('model_id')->constrained('ai_models')->onDelete('cascade');
            $table->foreignId('user_provider_id')->constrained('user_ai_providers')->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->string('custom_name')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'model_id', 'user_provider_id']);
            $table->index(['user_id']);
            $table->index(['model_id']);
            $table->index(['user_provider_id']);
            $table->index(['is_active']);
            $table->index(['is_default']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_ai_models');
    }
};
