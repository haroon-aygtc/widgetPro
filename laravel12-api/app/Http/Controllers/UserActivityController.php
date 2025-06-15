<?php

namespace App\Http\Controllers;

use App\Services\UserActivityService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserActivityController extends Controller
{
    public function __construct(
        private UserActivityService $activityService
    ) {}

    /**
     * Display a listing of user activities.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'user_id', 'action', 'status', 'date_from', 'date_to']);
        $perPage = $request->get('per_page', 15);

        $activities = $this->activityService->getActivities($filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $activities->items(),
            'meta' => [
                'current_page' => $activities->currentPage(),
                'last_page' => $activities->lastPage(),
                'per_page' => $activities->perPage(),
                'total' => $activities->total(),
            ]
        ]);
    }

    /**
     * Get activity statistics.
     */
    public function statistics(Request $request): JsonResponse
    {
        $filters = $request->only(['date_from', 'date_to']);
        $statistics = $this->activityService->getStatistics($filters);

        return response()->json([
            'success' => true,
            'data' => $statistics
        ]);
    }

    /**
     * Get available activity types.
     */
    public function types(): JsonResponse
    {
        $types = $this->activityService->getActivityTypes();

        return response()->json([
            'success' => true,
            'data' => $types
        ]);
    }

    /**
     * Export user activities.
     */
    public function export(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'user_id', 'action', 'status', 'date_from', 'date_to']);

        try {
            $activities = $this->activityService->exportActivities($filters);

            return response()->json([
                'success' => true,
                'data' => $activities,
                'message' => 'Activities exported successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export activities: ' . $e->getMessage()
            ], 500);
        }
    }
}
