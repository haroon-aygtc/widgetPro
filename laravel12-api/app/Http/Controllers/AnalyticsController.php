<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\AnalyticsService;

class AnalyticsController extends Controller
{
    protected AnalyticsService $analyticsService;

    public function __construct(AnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Get dashboard metrics
     */
    public function getDashboardMetrics(Request $request): JsonResponse
    {
        $request->validate([
            'date_range' => 'sometimes|string|in:1d,7d,30d,90d',
            'widget_id' => 'sometimes|integer|exists:widgets,id'
        ]);

        $dateRange = $request->get('date_range', '7d');
        $widgetId = $request->get('widget_id');
        $userId = auth()->id();

        try {
            $data = $this->analyticsService->getDashboardMetrics($userId, $dateRange, $widgetId);
            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard metrics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get conversation analytics
     */
    public function getConversationAnalytics(Request $request): JsonResponse
    {
        $request->validate([
            'date_range' => 'sometimes|string|in:1d,7d,30d,90d',
            'widget_id' => 'sometimes|integer|exists:widgets,id'
        ]);

        $dateRange = $request->get('date_range', '7d');
        $widgetId = $request->get('widget_id');
        $userId = auth()->id();

        $startDate = $this->getStartDate($dateRange);

        // Base query for user's widgets
        $widgetsQuery = DB::table('widgets')->where('user_id', $userId);
        if ($widgetId) {
            $widgetsQuery->where('id', $widgetId);
        }
        $widgetIds = $widgetsQuery->pluck('id');

        // Hourly conversation distribution
        $hourlyDistribution = DB::table('conversations')
            ->selectRaw('HOUR(created_at) as hour, COUNT(*) as count')
            ->whereIn('widget_id', $widgetIds)
            ->where('created_at', '>=', $startDate)
            ->groupBy('hour')
            ->orderBy('hour')
            ->get();

        // Top conversation topics (if you have topic classification)
        $topTopics = DB::table('conversation_topics')
            ->join('conversations', 'conversation_topics.conversation_id', '=', 'conversations.id')
            ->selectRaw('conversation_topics.topic, COUNT(*) as count')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('conversations.created_at', '>=', $startDate)
            ->groupBy('conversation_topics.topic')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // Response quality metrics
        $qualityMetrics = [
            'avgRating' => DB::table('conversation_ratings')
                ->join('conversations', 'conversation_ratings.conversation_id', '=', 'conversations.id')
                ->whereIn('conversations.widget_id', $widgetIds)
                ->where('conversation_ratings.created_at', '>=', $startDate)
                ->avg('conversation_ratings.rating') ?? 0,

            'resolutionRate' => $this->calculateResolutionRate($widgetIds, $startDate),
            'firstResponseRate' => $this->calculateFirstResponseRate($widgetIds, $startDate),
        ];

        return response()->json([
            'hourlyDistribution' => $hourlyDistribution,
            'topTopics' => $topTopics,
            'qualityMetrics' => $qualityMetrics,
            'period' => $dateRange,
        ]);
    }

    /**
     * Get user analytics
     */
    public function getUserAnalytics(Request $request): JsonResponse
    {
        $request->validate([
            'date_range' => 'sometimes|string|in:1d,7d,30d,90d',
            'widget_id' => 'sometimes|integer|exists:widgets,id'
        ]);

        $dateRange = $request->get('date_range', '7d');
        $widgetId = $request->get('widget_id');
        $userId = auth()->id();

        $startDate = $this->getStartDate($dateRange);

        // Base query for user's widgets
        $widgetsQuery = DB::table('widgets')->where('user_id', $userId);
        if ($widgetId) {
            $widgetsQuery->where('id', $widgetId);
        }
        $widgetIds = $widgetsQuery->pluck('id');

        // User growth data
        $userGrowth = DB::table('conversations')
            ->selectRaw('DATE(created_at) as date, COUNT(DISTINCT user_identifier) as new_users')
            ->whereIn('widget_id', $widgetIds)
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Geographic distribution (if you track location)
        $geoDistribution = DB::table('conversation_metadata')
            ->join('conversations', 'conversation_metadata.conversation_id', '=', 'conversations.id')
            ->selectRaw('conversation_metadata.country, COUNT(*) as count')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('conversations.created_at', '>=', $startDate)
            ->whereNotNull('conversation_metadata.country')
            ->groupBy('conversation_metadata.country')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // Device distribution
        $deviceDistribution = DB::table('conversation_metadata')
            ->join('conversations', 'conversation_metadata.conversation_id', '=', 'conversations.id')
            ->selectRaw('conversation_metadata.device_type, COUNT(*) as count')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('conversations.created_at', '>=', $startDate)
            ->whereNotNull('conversation_metadata.device_type')
            ->groupBy('conversation_metadata.device_type')
            ->get();

        return response()->json([
            'userGrowth' => $userGrowth,
            'geoDistribution' => $geoDistribution,
            'deviceDistribution' => $deviceDistribution,
            'period' => $dateRange,
        ]);
    }

    /**
     * Get performance metrics
     */
    public function getPerformanceMetrics(Request $request): JsonResponse
    {
        $request->validate([
            'date_range' => 'sometimes|string|in:1d,7d,30d,90d',
            'widget_id' => 'sometimes|integer|exists:widgets,id'
        ]);

        $dateRange = $request->get('date_range', '7d');
        $widgetId = $request->get('widget_id');
        $userId = auth()->id();

        $startDate = $this->getStartDate($dateRange);

        // Base query for user's widgets
        $widgetsQuery = DB::table('widgets')->where('user_id', $userId);
        if ($widgetId) {
            $widgetsQuery->where('id', $widgetId);
        }
        $widgetIds = $widgetsQuery->pluck('id');

        // Response time trends
        $responseTimeTrends = DB::table('messages')
            ->join('conversations', 'messages.conversation_id', '=', 'conversations.id')
            ->selectRaw('DATE(messages.created_at) as date, AVG(messages.response_time_ms) as avg_response_time')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('messages.created_at', '>=', $startDate)
            ->where('messages.is_bot', true)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // System health metrics
        $systemHealth = [
            'uptime' => $this->calculateUptime($widgetIds, $startDate),
            'errorRate' => $this->calculateErrorRate($widgetIds, $startDate),
            'throughput' => $this->calculateThroughput($widgetIds, $startDate),
        ];

        // AI model performance
        $modelPerformance = DB::table('messages')
            ->join('conversations', 'messages.conversation_id', '=', 'conversations.id')
            ->join('widgets', 'conversations.widget_id', '=', 'widgets.id')
            ->join('user_ai_models', 'widgets.ai_model_id', '=', 'user_ai_models.id')
            ->join('ai_models', 'user_ai_models.model_id', '=', 'ai_models.id')
            ->selectRaw('ai_models.display_name, AVG(messages.response_time_ms) as avg_response_time, COUNT(*) as total_messages')
            ->whereIn('conversations.widget_id', $widgetIds)
            ->where('messages.created_at', '>=', $startDate)
            ->where('messages.is_bot', true)
            ->groupBy('ai_models.id', 'ai_models.display_name')
            ->get();

        return response()->json([
            'responseTimeTrends' => $responseTimeTrends,
            'systemHealth' => $systemHealth,
            'modelPerformance' => $modelPerformance,
            'period' => $dateRange,
        ]);
    }

    /**
     * Get widget-specific analytics
     */
    public function getWidgetAnalytics(Request $request, int $widgetId): JsonResponse
    {
        $widget = DB::table('widgets')
            ->where('id', $widgetId)
            ->where('user_id', auth()->id())
            ->first();

        if (!$widget) {
            return response()->json(['error' => 'Widget not found'], 404);
        }

        $request->validate([
            'date_range' => 'sometimes|string|in:1d,7d,30d,90d'
        ]);

        $dateRange = $request->get('date_range', '7d');
        $startDate = $this->getStartDate($dateRange);

        // Widget-specific metrics
        $metrics = [
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

        return response()->json([
            'widget' => $widget,
            'metrics' => $metrics,
            'period' => $dateRange,
        ]);
    }

    // Helper methods

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

    private function calculateResolutionRate(array $widgetIds, Carbon $startDate): float
    {
        $totalConversations = DB::table('conversations')
            ->whereIn('widget_id', $widgetIds)
            ->where('created_at', '>=', $startDate)
            ->count();

        $resolvedConversations = DB::table('conversations')
            ->whereIn('widget_id', $widgetIds)
            ->where('created_at', '>=', $startDate)
            ->where('status', 'resolved')
            ->count();

        return $totalConversations > 0 ? ($resolvedConversations / $totalConversations) * 100 : 0;
    }

    private function calculateFirstResponseRate(array $widgetIds, Carbon $startDate): float
    {
        $totalConversations = DB::table('conversations')
            ->whereIn('widget_id', $widgetIds)
            ->where('created_at', '>=', $startDate)
            ->count();

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

        return $totalConversations > 0 ? ($firstResponseConversations / $totalConversations) * 100 : 0;
    }

    private function calculateUptime(array $widgetIds, Carbon $startDate): float
    {
        // Implement uptime calculation based on your system health tracking
        return 99.9; // Placeholder
    }

    private function calculateErrorRate(array $widgetIds, Carbon $startDate): float
    {
        // Implement error rate calculation
        return 0.1; // Placeholder
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
        // Implement conversion rate calculation based on your business logic
        return 0; // Placeholder
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
