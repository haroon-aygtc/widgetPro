<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsService
{
    /**
     * Get dashboard metrics for a user
     */
    public function getDashboardMetrics(int $userId, string $dateRange = '7d', ?int $widgetId = null): array
    {
        $startDate = $this->getStartDate($dateRange);
        $widgetIds = $this->getUserWidgetIds($userId, $widgetId);

        $metrics = $this->calculateMetrics($widgetIds, $startDate, $dateRange);
        $trends = $this->getConversationTrends($widgetIds, $startDate);
        $recentActivity = $this->getRecentActivity($widgetIds, 10);

        return [
            'metrics' => $metrics,
            'trends' => $trends,
            'recentActivity' => $recentActivity,
            'period' => $dateRange,
            'startDate' => $startDate->toISOString(),
            'endDate' => now()->toISOString(),
        ];
    }

    /**
     * Get conversation analytics
     */
    public function getConversationAnalytics(int $userId, string $dateRange = '7d', ?int $widgetId = null): array
    {
        $startDate = $this->getStartDate($dateRange);
        $widgetIds = $this->getUserWidgetIds($userId, $widgetId);

        return [
            'hourlyDistribution' => $this->getHourlyDistribution($widgetIds, $startDate),
            'topTopics' => $this->getTopTopics($widgetIds, $startDate),
            'qualityMetrics' => $this->getQualityMetrics($widgetIds, $startDate),
            'period' => $dateRange,
        ];
    }

    /**
     * Get user analytics
     */
    public function getUserAnalytics(int $userId, string $dateRange = '7d', ?int $widgetId = null): array
    {
        $startDate = $this->getStartDate($dateRange);
        $widgetIds = $this->getUserWidgetIds($userId, $widgetId);

        return [
            'userGrowth' => $this->getUserGrowth($widgetIds, $startDate),
            'geoDistribution' => $this->getGeoDistribution($widgetIds, $startDate),
            'deviceDistribution' => $this->getDeviceDistribution($widgetIds, $startDate),
            'period' => $dateRange,
        ];
    }

    /**
     * Get performance metrics
     */
    public function getPerformanceMetrics(int $userId, string $dateRange = '7d', ?int $widgetId = null): array
    {
        $startDate = $this->getStartDate($dateRange);
        $widgetIds = $this->getUserWidgetIds($userId, $widgetId);

        return [
            'responseTimeTrends' => $this->getResponseTimeTrends($widgetIds, $startDate),
            'systemHealth' => $this->getSystemHealth($widgetIds, $startDate),
            'modelPerformance' => $this->getModelPerformance($widgetIds, $startDate),
            'period' => $dateRange,
        ];
    }

    /**
     * Get widget-specific analytics
     */
    public function getWidgetAnalytics(int $userId, int $widgetId, string $dateRange = '7d'): array
    {
        $widget = $this->getWidget($userId, $widgetId);
        $startDate = $this->getStartDate($dateRange);

        return [
            'widget' => $widget,
            'metrics' => $this->getWidgetMetrics($widgetId, $startDate),
            'period' => $dateRange,
        ];
    }

    // Private helper methods

    private function getStartDate(string $dateRange): Carbon
    {
        return match($dateRange) {
            '1d' => now()->subDay(),
            '7d' => now()->subWeek(),
            '30d' => now()->subMonth(),
            '90d' => now()->subMonths(3),
            default => now()->subWeek(),
        };
    }

    private function getUserWidgetIds(int $userId, ?int $widgetId = null): array
    {
        $query = DB::table('widgets')->where('user_id', $userId);

        if ($widgetId) {
            $query->where('id', $widgetId);
        }

        return $query->pluck('id')->toArray();
    }

    private function calculateMetrics(array $widgetIds, Carbon $startDate, string $dateRange): array
    {
        $previousPeriodStart = $startDate->copy()->subtract($this->getPeriodDuration($dateRange));

        // Current period metrics
        $totalConversations = $this->getConversationCount($widgetIds, $startDate);
        $activeUsers = $this->getActiveUserCount($widgetIds, $startDate);
        $avgResponseTime = $this->getAverageResponseTime($widgetIds, $startDate);
        $satisfactionRate = $this->getSatisfactionRate($widgetIds, $startDate);

        // Previous period for comparison
        $previousConversations = $this->getConversationCount($widgetIds, $previousPeriodStart, $startDate);
        $previousActiveUsers = $this->getActiveUserCount($widgetIds, $previousPeriodStart, $startDate);

        return [
            'totalConversations' => $totalConversations,
            'conversationChange' => $this->calculatePercentageChange($previousConversations, $totalConversations),
            'activeUsers' => $activeUsers,
            'userChange' => $this->calculatePercentageChange($previousActiveUsers, $activeUsers),
            'avgResponseTime' => round($avgResponseTime / 1000, 1) . 's',
            'satisfactionRate' => round($satisfactionRate, 1) . '%',
        ];
    }

    private function getConversationCount(array $widgetIds, Carbon $startDate, ?Carbon $endDate = null): int
    {
        $query = DB::table('conversations')
            ->whereIn('widget_id', $widgetIds)
            ->where('created_at', '>=', $startDate);

        if ($endDate) {
            $query->where('created_at', '<', $endDate);
        }

        return $query->count();
    }

    private function getActiveUserCount(array $widgetIds, Carbon $startDate, ?Carbon $endDate = null): int
    {
        $query = DB::table('conversations')
            ->whereIn('widget_id', $widgetIds)
            ->where('created_at', '>=', $startDate);

        if ($endDate) {
            $query->where('created_at', '<', $endDate);
        }

        return $query->distinct('user_identifier')->count('user_identifier');
    }

    private function getAverageResponseTime(array $widgetIds, Carbon $startDate): float
    {
        return DB::table('messages')
            ->join('conversations', 'messages.conversation_id', '=', 'conversations.id')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('messages.created_at', '>=', $startDate)
            ->where('messages.is_bot', true)
            ->avg('messages.response_time_ms') ?? 0;
    }

    private function getSatisfactionRate(array $widgetIds, Carbon $startDate): float
    {
        $totalRatings = DB::table('conversation_ratings')
            ->join('conversations', 'conversation_ratings.conversation_id', '=', 'conversations.id')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('conversation_ratings.created_at', '>=', $startDate)
            ->count();

        if ($totalRatings === 0) {
            return 0;
        }

        $positiveRatings = DB::table('conversation_ratings')
            ->join('conversations', 'conversation_ratings.conversation_id', '=', 'conversations.id')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('conversation_ratings.created_at', '>=', $startDate)
            ->where('conversation_ratings.rating', '>=', 4)
            ->count();

        return ($positiveRatings / $totalRatings) * 100;
    }

    private function calculatePercentageChange(int $previous, int $current): float
    {
        if ($previous === 0) {
            return $current > 0 ? 100 : 0;
        }

        return (($current - $previous) / $previous) * 100;
    }

    private function getPeriodDuration(string $dateRange): \DateInterval
    {
        return match($dateRange) {
            '1d' => new \DateInterval('P1D'),
            '7d' => new \DateInterval('P7D'),
            '30d' => new \DateInterval('P30D'),
            '90d' => new \DateInterval('P90D'),
            default => new \DateInterval('P7D'),
        };
    }

    private function getConversationTrends(array $widgetIds, Carbon $startDate): array
    {
        return DB::table('conversations')
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->whereIn('widget_id', $widgetIds)
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
    }

    private function getRecentActivity(array $widgetIds, int $limit): array
    {
        return DB::table('user_activities')
            ->join('widgets', 'user_activities.widget_id', '=', 'widgets.id')
            ->select([
                'user_activities.activity_type',
                'user_activities.description',
                'user_activities.created_at',
                'widgets.name as widget_name'
            ])
            ->whereIn('user_activities.widget_id', $widgetIds)
            ->orderBy('user_activities.created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($activity) {
                return [
                    'title' => $this->formatActivityTitle($activity->activity_type),
                    'description' => $activity->description,
                    'time' => Carbon::parse($activity->created_at)->diffForHumans(),
                    'type' => $this->mapActivityType($activity->activity_type),
                    'status' => 'success',
                ];
            })
            ->toArray();
    }

    private function getHourlyDistribution(array $widgetIds, Carbon $startDate): array
    {
        return DB::table('conversations')
            ->selectRaw('HOUR(created_at) as hour, COUNT(*) as count')
            ->whereIn('widget_id', $widgetIds)
            ->where('created_at', '>=', $startDate)
            ->groupBy('hour')
            ->orderBy('hour')
            ->get()
            ->toArray();
    }

    private function getTopTopics(array $widgetIds, Carbon $startDate): array
    {
        return DB::table('conversation_topics')
            ->join('conversations', 'conversation_topics.conversation_id', '=', 'conversations.id')
            ->selectRaw('conversation_topics.topic, COUNT(*) as count')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('conversations.created_at', '>=', $startDate)
            ->groupBy('conversation_topics.topic')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($topic) {
                return [
                    'topic' => $topic->topic,
                    'count' => $topic->count,
                    'percentage' => 0, // Calculate based on total
                ];
            })
            ->toArray();
    }

    private function getQualityMetrics(array $widgetIds, Carbon $startDate): array
    {
        return [
            'avgRating' => DB::table('conversation_ratings')
                ->join('conversations', 'conversation_ratings.conversation_id', '=', 'conversations.id')
                ->whereIn('conversations.widget_id', $widgetIds)
                ->where('conversation_ratings.created_at', '>=', $startDate)
                ->avg('conversation_ratings.rating') ?? 0,
            'resolutionRate' => $this->calculateResolutionRate($widgetIds, $startDate),
            'firstResponseRate' => $this->calculateFirstResponseRate($widgetIds, $startDate),
        ];
    }

    private function getUserGrowth(array $widgetIds, Carbon $startDate): array
    {
        return DB::table('conversations')
            ->selectRaw('DATE(created_at) as date, COUNT(DISTINCT user_identifier) as new_users')
            ->whereIn('widget_id', $widgetIds)
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
    }

    private function getGeoDistribution(array $widgetIds, Carbon $startDate): array
    {
        return DB::table('conversation_metadata')
            ->join('conversations', 'conversation_metadata.conversation_id', '=', 'conversations.id')
            ->selectRaw('conversation_metadata.country, COUNT(*) as count')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('conversations.created_at', '>=', $startDate)
            ->whereNotNull('conversation_metadata.country')
            ->groupBy('conversation_metadata.country')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->toArray();
    }

    private function getDeviceDistribution(array $widgetIds, Carbon $startDate): array
    {
        return DB::table('conversation_metadata')
            ->join('conversations', 'conversation_metadata.conversation_id', '=', 'conversations.id')
            ->selectRaw('conversation_metadata.device_type, COUNT(*) as count')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('conversations.created_at', '>=', $startDate)
            ->whereNotNull('conversation_metadata.device_type')
            ->groupBy('conversation_metadata.device_type')
            ->get()
            ->toArray();
    }

    private function getResponseTimeTrends(array $widgetIds, Carbon $startDate): array
    {
        return DB::table('messages')
            ->join('conversations', 'messages.conversation_id', '=', 'conversations.id')
            ->selectRaw('DATE(messages.created_at) as date, AVG(messages.response_time_ms) as avg_response_time')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('messages.created_at', '>=', $startDate)
            ->where('messages.is_bot', true)
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->toArray();
    }

    private function getSystemHealth(array $widgetIds, Carbon $startDate): array
    {
        return [
            'uptime' => $this->calculateUptime($widgetIds, $startDate),
            'errorRate' => $this->calculateErrorRate($widgetIds, $startDate),
            'throughput' => $this->calculateThroughput($widgetIds, $startDate),
        ];
    }

    private function getModelPerformance(array $widgetIds, Carbon $startDate): array
    {
        return DB::table('messages')
            ->join('conversations', 'messages.conversation_id', '=', 'conversations.id')
            ->join('widgets', 'conversations.widget_id', '=', 'widgets.id')
            ->join('user_ai_models', 'widgets.ai_model_id', '=', 'user_ai_models.id')
            ->join('ai_models', 'user_ai_models.model_id', '=', 'ai_models.id')
            ->selectRaw('ai_models.display_name, AVG(messages.response_time_ms) as avg_response_time, COUNT(*) as total_messages')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('messages.created_at', '>=', $startDate)
            ->where('messages.is_bot', true)
            ->groupBy('ai_models.id', 'ai_models.display_name')
            ->get()
            ->toArray();
    }

    private function getWidget(int $userId, int $widgetId): ?object
    {
        return DB::table('widgets')
            ->where('id', $widgetId)
            ->where('user_id', $userId)
            ->first();
    }

    private function getWidgetMetrics(int $widgetId, Carbon $startDate): array
    {
        return [
            'totalConversations' => DB::table('conversations')
                ->where('widget_id', $widgetId)
                ->where('created_at', '>=', $startDate)
                ->count(),
            'uniqueUsers' => DB::table('conversations')
                ->where('widget_id', $widgetId)
                ->where('created_at', '>=', $startDate)
                ->distinct('user_identifier')
                ->count('user_identifier'),
            'avgSessionDuration' => DB::table('conversations')
                ->where('widget_id', $widgetId)
                ->where('created_at', '>=', $startDate)
                ->whereNotNull('ended_at')
                ->avg(DB::raw('TIMESTAMPDIFF(SECOND, created_at, ended_at)')),
            'conversionRate' => $this->calculateConversionRate($widgetId, $startDate),
        ];
    }

    private function calculateResolutionRate(array $widgetIds, Carbon $startDate): float
    {
        $totalConversations = $this->getConversationCount($widgetIds, $startDate);

        if ($totalConversations === 0) {
            return 0;
        }

        $resolvedConversations = DB::table('conversations')
            ->whereIn('widget_id', $widgetIds)
            ->where('created_at', '>=', $startDate)
            ->where('status', 'resolved')
            ->count();

        return ($resolvedConversations / $totalConversations) * 100;
    }

    private function calculateFirstResponseRate(array $widgetIds, Carbon $startDate): float
    {
        $totalConversations = $this->getConversationCount($widgetIds, $startDate);

        if ($totalConversations === 0) {
            return 0;
        }

        $firstResponseConversations = DB::table('conversations')
            ->whereIn('widget_id', $widgetIds)
            ->where('created_at', '>=', $startDate)
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('messages')
                    ->whereColumn('messages.conversation_id', 'conversations.id')
                    ->where('messages.is_bot', true)
                    ->limit(1);
            })
            ->count();

        return ($firstResponseConversations / $totalConversations) * 100;
    }

    private function calculateUptime(array $widgetIds, Carbon $startDate): float
    {
        // Implement based on your uptime tracking system
        return 99.9;
    }

    private function calculateErrorRate(array $widgetIds, Carbon $startDate): float
    {
        // Implement based on your error tracking
        return 0.1;
    }

    private function calculateThroughput(array $widgetIds, Carbon $startDate): float
    {
        $totalMessages = DB::table('messages')
            ->join('conversations', 'messages.conversation_id', '=', 'conversations.id')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('messages.created_at', '>=', $startDate)
            ->count();

        $hours = $startDate->diffInHours(now());
        return $hours > 0 ? $totalMessages / $hours : 0;
    }

    private function calculateConversionRate(int $widgetId, Carbon $startDate): float
    {
        // Implement based on your conversion tracking
        return 0;
    }

    private function formatActivityTitle(string $activityType): string
    {
        return match($activityType) {
            'conversation_started' => 'New conversation started',
            'high_volume' => 'High conversation volume',
            'user_engagement' => 'New user engagement',
            'performance_alert' => 'Performance alert',
            'system_update' => 'System update completed',
            default => ucfirst(str_replace('_', ' ', $activityType)),
        };
    }

    private function mapActivityType(string $activityType): string
    {
        return match($activityType) {
            'conversation_started' => 'conversation',
            'high_volume' => 'conversation',
            'user_engagement' => 'user',
            'performance_alert' => 'widget',
            'system_update' => 'system',
            default => 'system',
        };
    }
}
