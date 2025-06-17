<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Check if the table exists and add missing columns
        if (Schema::hasTable('user_ai_models')) {
            Schema::table('user_ai_models', function (Blueprint $table) {
                // Add model_id column if it doesn't exist
                if (!Schema::hasColumn('user_ai_models', 'model_id')) {
                    $table->foreignId('model_id')->constrained('ai_models')->onDelete('cascade')->after('user_id');
                }
                
                // Add user_provider_id column if it doesn't exist
                if (!Schema::hasColumn('user_ai_models', 'user_provider_id')) {
                    $table->foreignId('user_provider_id')->constrained('user_ai_providers')->onDelete('cascade')->after('model_id');
                }
                
                // Add is_active column if it doesn't exist
                if (!Schema::hasColumn('user_ai_models', 'is_active')) {
                    $table->boolean('is_active')->default(true)->after('user_provider_id');
                }
                
                // Add is_default column if it doesn't exist
                if (!Schema::hasColumn('user_ai_models', 'is_default')) {
                    $table->boolean('is_default')->default(false)->after('is_active');
                }
                
                // Add custom_name column if it doesn't exist
                if (!Schema::hasColumn('user_ai_models', 'custom_name')) {
                    $table->string('custom_name')->nullable()->after('is_default');
                }
            });
            
            // Add indexes if they don't exist
            Schema::table('user_ai_models', function (Blueprint $table) {
                // Check if unique constraint exists, if not add it
                try {
                    $table->unique(['user_id', 'model_id', 'user_provider_id'], 'user_model_provider_unique');
                } catch (\Exception $e) {
                    // Index might already exist, ignore
                }
                
                // Add individual indexes
                try {
                    $table->index(['user_id'], 'user_ai_models_user_id_index');
                } catch (\Exception $e) {
                    // Index might already exist, ignore
                }
                
                try {
                    $table->index(['model_id'], 'user_ai_models_model_id_index');
                } catch (\Exception $e) {
                    // Index might already exist, ignore
                }
                
                try {
                    $table->index(['user_provider_id'], 'user_ai_models_user_provider_id_index');
                } catch (\Exception $e) {
                    // Index might already exist, ignore
                }
                
                try {
                    $table->index(['is_active'], 'user_ai_models_is_active_index');
                } catch (\Exception $e) {
                    // Index might already exist, ignore
                }
                
                try {
                    $table->index(['is_default'], 'user_ai_models_is_default_index');
                } catch (\Exception $e) {
                    // Index might already exist, ignore
                }
            });
        } else {
            // Create the table if it doesn't exist
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
    }

    public function down(): void
    {
        // This migration is designed to be safe and not drop anything
        // If you need to rollback, manually remove the columns
    }
};
