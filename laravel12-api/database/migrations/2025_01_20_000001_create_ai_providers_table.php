<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_providers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->string('api_base_url');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_free')->default(false);
            $table->boolean('is_default')->default(false);
            $table->string('logo_url')->nullable();
            $table->string('documentation_url')->nullable();
            $table->string('provider_icon')->nullable();
            $table->string('status_color')->nullable();
            $table->timestamps();

            $table->index(['is_active']);
            $table->index(['name']);
            $table->index(['is_default']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_providers');
    }
};
