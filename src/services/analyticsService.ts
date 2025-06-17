import React from 'react';
import { analyticsAPI, AnalyticsAPIFilters } from '@/lib/api/analyticsAPI';


// Service class for business logic
class AnalyticsService {
    /**
     * Get dashboard metrics with business logic
     */
    async getDashboardMetrics(
        dateRange: '1d' | '7d' | '30d' | '90d' = '7d',
        widgetId?: number
    ): Promise<{
        metrics: DashboardMetrics;
        trends: ConversationTrend[];
        recentActivity: ActivityItem[];
        period: string;
        startDate: string;
        endDate: string;
    }> {
        try {
            const filters: AnalyticsAPIFilters = {
                date_range: dateRange,
                widget_id: widgetId,
            };

            const response = await analyticsAPI.getDashboardMetrics(filters);

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch dashboard metrics');
            }

            // Apply business logic transformations here if needed
            return this.transformDashboardData(response.data);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch analytics');
        }
    }

    /**
     * Get conversation analytics
     */
    async getConversationAnalytics(
        dateRange: '1d' | '7d' | '30d' | '90d' = '7d',
        widgetId?: number
    ): Promise<ConversationAnalytics & { period: string }> {
        try {
            const filters: AnalyticsAPIFilters = {
                date_range: dateRange,
                widget_id: widgetId,
            };

            const response = await analyticsAPI.getConversationAnalytics(filters);

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch conversation analytics');
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch conversation analytics');
        }
    }

    /**
     * Get user analytics
     */
    async getUserAnalytics(
        dateRange: '1d' | '7d' | '30d' | '90d' = '7d',
        widgetId?: number
    ): Promise<UserAnalytics & { period: string }> {
        try {
            const filters: AnalyticsAPIFilters = {
                date_range: dateRange,
                widget_id: widgetId,
            };

            const response = await analyticsAPI.getUserAnalytics(filters);

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch user analytics');
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch user analytics');
        }
    }

    /**
     * Get performance metrics
     */
    async getPerformanceMetrics(
        dateRange: '1d' | '7d' | '30d' | '90d' = '7d',
        widgetId?: number
    ): Promise<PerformanceMetrics & { period: string }> {
        try {
            const filters: AnalyticsAPIFilters = {
                date_range: dateRange,
                widget_id: widgetId,
            };

            const response = await analyticsAPI.getPerformanceMetrics(filters);

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch performance metrics');
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch performance metrics');
        }
    }

    /**
     * Get widget-specific analytics
     */
    async getWidgetAnalytics(
        widgetId: number,
        dateRange: '1d' | '7d' | '30d' | '90d' = '7d'
    ): Promise<WidgetAnalytics & { period: string }> {
        try {
            const response = await analyticsAPI.getWidgetAnalytics(widgetId, dateRange);

            if (!response.success || !response.data) {
                throw new Error(response.message || 'Failed to fetch widget analytics');
            }

            return response.data;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch widget analytics');
        }
    }

    /**
     * Export analytics data
     */
    async exportAnalytics(
        type: 'conversations' | 'users' | 'performance',
        dateRange: '1d' | '7d' | '30d' | '90d' = '7d',
        widgetId?: number,
        format: 'csv' | 'xlsx' = 'csv'
    ): Promise<Blob> {
        try {
            const filters: AnalyticsAPIFilters = {
                date_range: dateRange,
                widget_id: widgetId,
            };

            return await analyticsAPI.exportAnalytics(type, filters, format);
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to export analytics');
        }
    }

    // Private business logic methods
    private transformDashboardData(data: any): any {
        // Apply any business logic transformations here
        // For example: format numbers, calculate derived metrics, etc.
        return data;
    }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

// React Hooks for components
export const useAnalytics = (dateRange: string, widgetId?: number) => {
    const [data, setData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await analyticsService.getDashboardMetrics(
                dateRange as '1d' | '7d' | '30d' | '90d',
                widgetId
            );
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    }, [dateRange, widgetId]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

export const useConversationTrends = (dateRange: string, widgetId?: number) => {
    const [data, setData] = React.useState<ConversationTrend[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await analyticsService.getConversationAnalytics(
                    dateRange as '1d' | '7d' | '30d' | '90d',
                    widgetId
                );
                // Extract trends from conversation analytics
                setData(result.hourlyDistribution?.map(item => ({
                    date: `${item.hour}:00`,
                    count: item.count
                })) || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch conversation trends');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dateRange, widgetId]);

    return { data, loading, error };
};

export const useRecentActivity = (limit: number = 10) => {
    const [data, setData] = React.useState<ActivityItem[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await analyticsService.getDashboardMetrics('7d');
                setData(result.recentActivity || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch recent activity');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [limit]);

    return { data, loading, error };
}; 