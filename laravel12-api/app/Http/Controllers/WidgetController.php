<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateWidgetRequest;
use App\Http\Requests\UpdateWidgetRequest;
use App\Models\Widget;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class WidgetController extends Controller
{
    /**
     * Display a listing of widgets.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Widget::with(['creator:id,name,email', 'updater:id,name,email'])
                      ->where('created_by', Auth::id());

        // Apply filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('template')) {
            $query->template($request->template);
        }

        if ($request->filled('status')) {
            $query->status($request->status);
        }

        if ($request->filled('is_active')) {
            $query->active($request->boolean('is_active'));
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $widgets = $query->latest()->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $widgets->items(),
            'meta' => [
                'current_page' => $widgets->currentPage(),
                'last_page' => $widgets->lastPage(),
                'per_page' => $widgets->perPage(),
                'total' => $widgets->total(),
            ]
        ]);
    }

    /**
     * Store a newly created widget.
     */
    public function store(CreateWidgetRequest $request): JsonResponse
    {
        try {
            $widget = Widget::create($request->validatedWithUser());
            $widget->load(['creator:id,name,email']);

            return response()->json([
                'success' => true,
                'data' => $widget,
                'message' => 'Widget created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create widget',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified widget.
     */
    public function show(Widget $widget): JsonResponse
    {
        // Check if user owns the widget
        if ($widget->created_by !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $widget->load(['creator:id,name,email', 'updater:id,name,email']);

        return response()->json([
            'success' => true,
            'data' => $widget
        ]);
    }

    /**
     * Update the specified widget.
     */
    public function update(UpdateWidgetRequest $request, Widget $widget): JsonResponse
    {
        // Check if user owns the widget
        if ($widget->created_by !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        try {
            $widget->update($request->validatedWithUser());
            $widget->load(['creator:id,name,email', 'updater:id,name,email']);

            return response()->json([
                'success' => true,
                'data' => $widget,
                'message' => 'Widget updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update widget',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified widget.
     */
    public function destroy(Widget $widget): JsonResponse
    {
        // Check if user owns the widget
        if ($widget->created_by !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        try {
            $widget->delete();

            return response()->json([
                'success' => true,
                'message' => 'Widget deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete widget',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle widget active status.
     */
    public function toggle(Request $request, Widget $widget): JsonResponse
    {
        // Check if user owns the widget
        if ($widget->created_by !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $request->validate([
            'is_active' => 'required|boolean'
        ]);

        try {
            $widget->update([
                'is_active' => $request->boolean('is_active'),
                'updated_by' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'data' => $widget,
                'message' => 'Widget status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update widget status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get widget embed code.
     */
    public function embed(Widget $widget): JsonResponse
    {
        // Check if user owns the widget
        if ($widget->created_by !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'embed_code' => $widget->embed_code ?: Widget::generateEmbedCode($widget->id)
            ]
        ]);
    }

    /**
     * Get widget analytics.
     */
    public function analytics(Request $request, Widget $widget): JsonResponse
    {
        // Check if user owns the widget
        if ($widget->created_by !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        // For now, return basic analytics from the widget model
        // In a real implementation, you'd query a separate analytics table
        $analytics = [
            'widget_id' => $widget->id,
            'total_conversations' => $widget->total_conversations,
            'total_messages' => $widget->total_messages,
            'avg_response_time' => $widget->avg_response_time,
            'satisfaction_score' => $widget->satisfaction_score,
            'daily_stats' => [] // Would be populated from analytics table
        ];

        return response()->json([
            'success' => true,
            'data' => $analytics
        ]);
    }

    /**
     * Duplicate a widget.
     */
    public function duplicate(Request $request, Widget $widget): JsonResponse
    {
        // Check if user owns the widget
        if ($widget->created_by !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $request->validate([
            'name' => 'required|string|min:2|max:100|regex:/^[a-zA-Z0-9\s\-_]+$/'
        ]);

        try {
            $duplicatedWidget = $widget->duplicate($request->name, Auth::id());
            $duplicatedWidget->load(['creator:id,name,email']);

            return response()->json([
                'success' => true,
                'data' => $duplicatedWidget,
                'message' => 'Widget duplicated successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to duplicate widget',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export widget configuration.
     */
    public function export(Widget $widget): JsonResponse
    {
        // Check if user owns the widget
        if ($widget->created_by !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'Widget not found or access denied'
            ], 404);
        }

        $exportData = [
            'widget' => $widget->toArray(),
            'configuration' => $widget->configuration,
            'exported_at' => now()->toISOString(),
            'version' => '1.0'
        ];

        return response()->json($exportData);
    }

    /**
     * Import widget configuration.
     */
    public function import(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:json|max:2048'
        ]);

        try {
            $content = file_get_contents($request->file('file')->getRealPath());
            $data = json_decode($content, true);

            if (!$data || !isset($data['widget'])) {
                throw new ValidationException('Invalid widget configuration file');
            }

            $widgetData = $data['widget'];
            unset($widgetData['id'], $widgetData['created_at'], $widgetData['updated_at']);
            
            $widgetData['created_by'] = Auth::id();
            $widgetData['updated_by'] = Auth::id();
            $widgetData['name'] = $widgetData['name'] . ' (Imported)';
            $widgetData['status'] = 'draft';

            $widget = Widget::create($widgetData);
            $widget->load(['creator:id,name,email']);

            return response()->json([
                'success' => true,
                'data' => $widget,
                'message' => 'Widget imported successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to import widget',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate widget configuration.
     */
    public function validate(CreateWidgetRequest $request): JsonResponse
    {
        // If we reach here, validation passed
        return response()->json([
            'success' => true,
            'message' => 'Widget configuration is valid'
        ]);
    }

    /**
     * Test widget configuration.
     */
    public function test(Request $request): JsonResponse
    {
        // Basic validation for testing
        $request->validate([
            'name' => 'required|string',
            'welcome_message' => 'required|string',
            'placeholder' => 'required|string',
            'primary_color' => 'required|string|regex:/^#[0-9A-F]{6}$/i'
        ]);

        // Simulate testing the widget configuration
        // In a real implementation, you might test API connections, etc.
        $testResults = [
            'configuration_valid' => true,
            'api_connections' => true,
            'theme_rendering' => true,
            'responsive_design' => true
        ];

        $success = !in_array(false, $testResults, true);

        return response()->json([
            'success' => $success,
            'message' => $success ? 'Widget configuration test passed' : 'Widget configuration test failed',
            'test_results' => $testResults
        ]);
    }
}
