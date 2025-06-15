import { userApi, UserActivity, handleApiError } from "@/lib/api";

// User Activity service class
export class UserActivityService {
  async getUserActivities(params?: {
    search?: string;
    user_id?: number;
    action?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
  }) {
    try {
      const response = await userApi.getUserActivities(params);
      return { success: true, data: response.data || [], error: null };
    } catch (error) {
      return { success: false, data: [], error: handleApiError(error) };
    }
  }

  async getUserActivityStatistics(params?: {
    date_from?: string;
    date_to?: string;
  }) {
    try {
      const response = await userApi.getUserActivityStatistics(params);
      return {
        success: true,
        data: response.data || {
          total_activities: 0,
          successful_activities: 0,
          failed_activities: 0,
          warning_activities: 0,
          unique_users: 0,
        },
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        data: {
          total_activities: 0,
          successful_activities: 0,
          failed_activities: 0,
          warning_activities: 0,
          unique_users: 0,
        },
        error: handleApiError(error),
      };
    }
  }
}

// Export singleton instance
export const userActivityService = new UserActivityService();
