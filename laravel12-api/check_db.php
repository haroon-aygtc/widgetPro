<?php

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    echo "Checking database connection...\n";
    
    // Test database connection
    DB::connection()->getPdo();
    echo "✅ Database connection successful\n";
    
    // Check if user_ai_models table exists
    if (Schema::hasTable('user_ai_models')) {
        echo "✅ user_ai_models table exists\n";
        
        // Get table columns
        $columns = Schema::getColumnListing('user_ai_models');
        echo "📋 Table columns: " . implode(', ', $columns) . "\n";
        
        // Check specific columns
        $requiredColumns = ['id', 'user_id', 'model_id', 'user_provider_id', 'is_active', 'is_default', 'custom_name'];
        foreach ($requiredColumns as $column) {
            if (Schema::hasColumn('user_ai_models', $column)) {
                echo "✅ Column '$column' exists\n";
            } else {
                echo "❌ Column '$column' missing\n";
            }
        }
        
        // Check table structure
        $tableInfo = DB::select("DESCRIBE user_ai_models");
        echo "\n📊 Full table structure:\n";
        foreach ($tableInfo as $column) {
            echo "  - {$column->Field} ({$column->Type}) " . 
                 ($column->Null === 'YES' ? 'NULL' : 'NOT NULL') . 
                 ($column->Key ? " KEY: {$column->Key}" : '') . 
                 ($column->Default !== null ? " DEFAULT: {$column->Default}" : '') . "\n";
        }
        
    } else {
        echo "❌ user_ai_models table does not exist\n";
        
        // Check what tables do exist
        $tables = DB::select('SHOW TABLES');
        echo "📋 Available tables:\n";
        foreach ($tables as $table) {
            $tableName = array_values((array)$table)[0];
            echo "  - $tableName\n";
        }
    }
    
    // Check migration status
    echo "\n📊 Migration status:\n";
    if (Schema::hasTable('migrations')) {
        $migrations = DB::table('migrations')->orderBy('batch')->get();
        foreach ($migrations as $migration) {
            echo "  ✅ {$migration->migration} (batch: {$migration->batch})\n";
        }
    } else {
        echo "❌ Migrations table does not exist\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
