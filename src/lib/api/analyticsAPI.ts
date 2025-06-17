import { BaseApiClient } from './config/BaseApiClient';
import { AxiosResponse } from 'axios';

export interface AnalyticsAPIFilters {
    date_range: '1d' | '7d' | '30d' | '90d';
    widget_id?: number;
}

export interface AnalyticsAPIResponse<T = any> {
    success?: boolean;
    data?: T;
    message?: string;
    error?: string;
}

class AnalyticsAPI extends BaseApiClient {
    constructor() {
        super();
    }

    /**
     * Get dashboard metrics from API
     */
    async getDashboardMetrics(filters: AnalyticsAPIFilters): Promise<AxiosResponse<AnalyticsAPIResponse>> {
        const params = new URLSearchParams();
        params.append('date_range', filters.date_range);

        if (filters.widget_id) {
            params.append('widget_id', filters.widget_id.toString());
        }

        return this.client.get(`/analytics/dashboard?${params.toString()}`);
    }

    /**
     * Get conversation analytics from API
     */
    async getConversationAnalytics(filters: AnalyticsAPIFilters): Promise<AxiosResponse<AnalyticsAPIResponse>> {
        const params = new URLSearchParams();
        params.append('date_range', filters.date_range);

        if (filters.widget_id) {
            params.append('widget_id', filters.widget_id.toString());
        }

        return this.client.get(`/analytics/conversations?${params.toString()}`);
    }

    /**
     * Get user analytics from API
     */
    async getUserAnalytics(filters: AnalyticsAPIFilters): Promise<AxiosResponse<AnalyticsAPIResponse>> {
        const params = new URLSearchParams();
        params.append('date_range', filters.date_range);

        if (filters.widget_id) {
            params.append('widget_id', filters.widget_id.toString());
        }

        return this.client.get(`/analytics/users?${params.toString()}`);
    }

    /**
     * Get performance metrics from API
     */
    async getPerformanceMetrics(filters: AnalyticsAPIFilters): Promise<AxiosResponse<AnalyticsAPIResponse>> {
        const params = new URLSearchParams();
        params.append('date_range', filters.date_range);

        if (filters.widget_id) {
            params.append('widget_id', filters.widget_id.toString());
        }

        return this.client.get(`/analytics/performance?${params.toString()}`);
    }

    /**
     * Get widget-specific analytics from API
     */
    async getWidgetAnalytics(widgetId: number, dateRange: string): Promise<AxiosResponse<AnalyticsAPIResponse>> {
        const params = new URLSearchParams();
        params.append('date_range', dateRange);

        return this.client.get(`/analytics/widgets/${widgetId}/analytics?${params.toString()}`);
    }

    /**
     * Export analytics data
     */
    async exportAnalytics(
        type: 'conversations' | 'users' | 'performance',
        filters: AnalyticsAPIFilters,
        format: 'csv' | 'xlsx' = 'csv'
    ): Promise<Blob> {
        const params = new URLSearchParams();
        params.append('type', type);
        params.append('date_range', filters.date_range);
        params.append('format', format);

        if (filters.widget_id) {
            params.append('widget_id', filters.widget_id.toString());
        }

        const response = await this.super.request(`/analytics/export?${params.toString()}`, { responseType: 'blob' });

        return response.data;
    }

    /**
     * Get real-time metrics
     */
    async getRealTimeMetrics(widgetIds?: number[]): Promise<AxiosResponse<AnalyticsAPIResponse>> {
        const params = new URLSearchParams();

        if (widgetIds && widgetIds.length > 0) {
            widgetIds.forEach(id => params.append('widget_ids[]', id.toString()));
        }

        return this.client.get(`/analytics/realtime?${params.toString()}`);
    }
}

export const analyticsAPI = new AnalyticsAPI(); 