import { useState, useEffect, useCallback } from "react";
import { UserActivity } from "@/types/user";
import { userActivityService } from "@/services/userActivityService";
import { useOperationLoading } from "@/contexts/LoadingContext";
import { toastUtils } from "@/components/ui/use-toast";
import { addDays } from "date-fns";

interface ActivityStatistics {
  total_activities: number;
  successful_activities: number;
  failed_activities: number;
  warning_activities: number;
  unique_users: number;
}

export function useUserActivity() {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [statistics, setStatistics] = useState<ActivityStatistics>({
    total_activities: 0,
    successful_activities: 0,
    failed_activities: 0,
    warning_activities: 0,
    unique_users: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActivity, setFilterActivity] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  const {
    isLoading,
    start: startLoading,
    stop: stopLoading,
  } = useOperationLoading("user-activity");

  // Fetch activities with debouncing
  const fetchActivities = useCallback(async () => {
    startLoading("Loading activities...");
    const result = await userActivityService.getUserActivities({
      search: searchTerm,
      action: filterActivity !== "all" ? filterActivity : undefined,
      date_from: dateRange.from?.toISOString().split("T")[0],
      date_to: dateRange.to?.toISOString().split("T")[0],
    });

    if (result.success) {
      setActivities(result.data);
    } else {
      toastUtils.apiError("Failed to load activities");
    }
    stopLoading();
  }, [searchTerm, filterActivity, dateRange, startLoading, stopLoading]);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    const result = await userActivityService.getUserActivityStatistics({
      date_from: dateRange.from?.toISOString().split("T")[0],
      date_to: dateRange.to?.toISOString().split("T")[0],
    });

    if (result.success) {
      setStatistics(result.data);
    } else {
      console.error("Failed to fetch statistics:", result.error);
    }
  }, [dateRange]);

  // Export activities to CSV
  const exportActivities = useCallback(() => {
    const filteredActivities = activities.filter((activity) => {
      const matchesSearch =
        activity.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.user?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        activity.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        activity.action?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesActivity =
        filterActivity === "all" || activity.action === filterActivity;
      const matchesUser =
        filterUser === "all" || activity.user?.name === filterUser;
      return matchesSearch && matchesActivity && matchesUser;
    });

    const csvContent = [
      [
        "User",
        "Email",
        "Action",
        "Status",
        "Timestamp",
        "IP Address",
        "User Agent",
        "Description",
      ].join(","),
      ...filteredActivities.map((activity) =>
        [
          activity.user?.name || "Unknown",
          activity.user?.email || "Unknown",
          activity.action || "Unknown",
          activity.status || "Unknown",
          activity.created_at
            ? new Date(activity.created_at).toLocaleString()
            : "Unknown",
          activity.ip_address || "Unknown",
          activity.user_agent || "Unknown",
          activity.description || "No description",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `user-activities-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [activities, searchTerm, filterActivity, filterUser]);

  // Get unique users from activities
  const users = [
    ...new Set(activities.map((a) => a.user?.name).filter(Boolean)),
  ];

  // Debounced activity fetching
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchActivities();
      fetchStatistics();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [fetchActivities, fetchStatistics]);

  return {
    // State
    activities,
    statistics,
    users,
    searchTerm,
    filterActivity,
    filterUser,
    dateRange,
    isLoading,

    // Actions
    setSearchTerm,
    setFilterActivity,
    setFilterUser,
    setDateRange,
    exportActivities,
    refetchActivities: fetchActivities,
    refetchStatistics: fetchStatistics,
  };
}
