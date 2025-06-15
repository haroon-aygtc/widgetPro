<?php

namespace App\Services;

use App\Models\UserActivity;
use Illuminate\Pagination\LengthAwarePaginator;
use Carbon\Carbon;

class UserActivityService
{
    /**
     * Get paginated user activities with optional filters.
     */
    public function getActivities(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = UserActivity::with(['user'])->orderBy('created_at', 'desc');

        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (!empty($filters['user_id'])) {
            $query->forUser($filters['user_id']);
        }

        if (!empty($filters['action'])) {
            $query->action($filters['action']);
        }

        if (!empty($filters['status'])) {
            $query->status($filters['status']);
        }

        if (!empty($filters['date_from']) && !empty($filters['date_to'])) {
            $query->dateRange(
                Carbon::parse($filters['date_from'])->startOfDay(),
                Carbon::parse($filters['date_to'])->endOfDay()
            );
        }

        return $query->paginate($perPage);
    }

    /**
     * Get activity statistics.
     */
    public function getStatistics(array $filters = []): array
    {
        $query = UserActivity::query();

        if (!empty($filters['date_from']) && !empty($filters['date_to'])) {
            $query->dateRange(
                Carbon::parse($filters['date_from'])->startOfDay(),
                Carbon::parse($filters['date_to'])->endOfDay()
            );
        }

        return [
            'total_activities' => $query->count(),
            'successful_activities' => $query->where('status', 'success')->count(),
            'failed_activities' => $query->where('status', 'failed')->count(),
            'warning_activities' => $query->where('status', 'warning')->count(),
            'unique_users' => $query->distinct('user_id')->count(),
        ];
    }

    /**
     * Get available activity types.
     */
    public function getActivityTypes(): array
    {
        return UserActivity::distinct('action')
            ->orderBy('action')
            ->pluck('action')
            ->toArray();
    }

    /**
     * Export activities (simplified - returns data array).
     */
    public function exportActivities(array $filters = []): array
    {
        $query = UserActivity::with(['user'])->orderBy('created_at', 'desc');

        // Apply same filters as getActivities
        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (!empty($filters['user_id'])) {
            $query->forUser($filters['user_id']);
        }

        if (!empty($filters['action'])) {
            $query->action($filters['action']);
        }

        if (!empty($filters['status'])) {
            $query->status($filters['status']);
        }

        if (!empty($filters['date_from']) && !empty($filters['date_to'])) {
            $query->dateRange(
                Carbon::parse($filters['date_from'])->startOfDay(),
                Carbon::parse($filters['date_to'])->endOfDay()
            );
        }

        return $query->limit(1000)->get()->toArray(); // Limit for performance
    }
}
