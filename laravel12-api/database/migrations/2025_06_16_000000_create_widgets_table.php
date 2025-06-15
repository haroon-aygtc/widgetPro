<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('widgets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('template', ['default', 'minimal', 'modern', 'enterprise'])->default('default');
            $table->string('primary_color', 7)->default('#4f46e5'); // Hex color
            $table->enum('position', ['bottom-right', 'bottom-left', 'top-right', 'top-left'])->default('bottom-right');
            $table->text('welcome_message');
            $table->string('placeholder');
            $table->string('bot_name')->default('AI Assistant');
            $table->text('bot_avatar')->nullable();
            $table->boolean('auto_open')->default(false);
            $table->enum('widget_theme', ['light', 'dark'])->default('light');
            $table->integer('widget_width')->default(350);
            $table->integer('widget_height')->default(500);
            
            // Auto trigger settings as JSON
            $table->json('auto_trigger')->nullable();
            
            // AI and Knowledge Base settings
            $table->string('ai_model')->nullable();
            $table->json('knowledge_base')->nullable();
            
            // Status and tracking
            $table->enum('status', ['active', 'inactive', 'draft'])->default('draft');
            $table->boolean('is_active')->default(true);
            
            // Embed code (generated)
            $table->text('embed_code')->nullable();
            
            // Analytics tracking
            $table->integer('total_conversations')->default(0);
            $table->integer('total_messages')->default(0);
            $table->decimal('avg_response_time', 8, 2)->default(0);
            $table->decimal('satisfaction_score', 3, 2)->default(0);
            
            // User tracking
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['created_by']);
            $table->index(['status']);
            $table->index(['is_active']);
            $table->index(['template']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('widgets');
    }
};
