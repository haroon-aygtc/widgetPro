<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_models', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained('ai_providers')->onDelete('cascade');
            $table->string('name')->index();
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->boolean('is_free')->default(false);
            $table->integer('max_tokens')->nullable();
            $table->integer('context_window')->nullable();
            $table->decimal('pricing_input', 10, 6)->nullable();
            $table->decimal('pricing_output', 10, 6)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['provider_id', 'name']);
            $table->index(['provider_id']);
            $table->index(['is_active']);
            $table->index(['is_free']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_models');
    }
};
