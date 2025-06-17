// Domain types for analytics
export interface DashboardMetrics {
    totalConversations: number;
    conversationChange: number;
    activeUsers: number;
    userChange: number;
    avgResponseTime: string;
    satisfactionRate: string;
}

export interface ConversationTrend {
    date: string;
    count: number;
}

export interface ActivityItem {
    title: string;
    description: string;
    time: string;
    type: 'conversation' | 'widget' | 'user' | 'system';
    status: 'success' | 'warning' | 'error';
}

export interface ConversationAnalytics {
    hourlyDistribution: Array<{ hour: number; count: number }>;
    topTopics: Array<{ topic: string; count: number; percentage: number }>;
    qualityMetrics: {
        avgRating: number;
        resolutionRate: number;
        firstResponseRate: number;
    };
}

export interface UserAnalytics {
    userGrowth: Array<{ date: string; new_users: number }>;
    geoDistribution: Array<{ country: string; count: number }>;
    deviceDistribution: Array<{ device_type: string; count: number }>;
}

export interface PerformanceMetrics {
    responseTimeTrends: Array<{ date: string; avg_response_time: number }>;
    systemHealth: {
        uptime: number;
        errorRate: number;
        throughput: number;
    };
    modelPerformance: Array<{
        display_name: string;
        avg_response_time: number;
        total_messages: number;
    }>;
}

export interface WidgetAnalytics {
    widget: {
        id: number;
        name: string;
        type: string;
    };
    metrics: {
        totalConversations: number;
        uniqueUsers: number;
        avgSessionDuration: number;
        conversionRate: number;
    };
}
