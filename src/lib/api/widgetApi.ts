import { BaseApiClient } from "./config/BaseApiClient";
import type { ApiResponse } from "../../types/api";
import type { WidgetListItem, WidgetApiData, WidgetAnalytics } from "../../types/widget";
import api from "./config/axios";

// Widget endpoints
class WidgetApiClient extends BaseApiClient {
    async getWidgets(params?: {
        search?: string;
        template?: string;
        is_active?: boolean;
        page?: number;
        per_page?: number;
    }): Promise<ApiResponse<WidgetListItem[]>> {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.append("search", params.search);
        if (params?.template) searchParams.append("template", params.template);
        if (params?.is_active !== undefined)
            searchParams.append("is_active", params.is_active.toString());
        if (params?.page) searchParams.append("page", params.page.toString());
        if (params?.per_page)
            searchParams.append("per_page", params.per_page.toString());
        const query = searchParams.toString();
        return super.request<ApiResponse<WidgetListItem[]>>(
            'GET',
            `/widgets${query ? `?${query}` : ""}`
        );
    }

    async getWidget(id: number): Promise<ApiResponse<WidgetApiData>> {
        return super.request<ApiResponse<WidgetApiData>>('GET', `/widgets/${id}`);
    }

    async createWidget(data: WidgetApiData): Promise<ApiResponse<WidgetApiData>> {
        return super.request<ApiResponse<WidgetApiData>>('POST', '/widgets', data);
    }

    async updateWidget(id: number, data: WidgetApiData): Promise<ApiResponse<WidgetApiData>> {
        return super.request<ApiResponse<WidgetApiData>>('PUT', `/widgets/${id}`, data);
    }

    async deleteWidget(id: number): Promise<ApiResponse<void>> {
        return super.request<ApiResponse<void>>('DELETE', `/widgets/${id}`);
    }

    async toggleWidgetStatus(id: number, is_active: boolean): Promise<ApiResponse<void>> {
        return super.request<ApiResponse<void>>('PATCH', `/widgets/${id}/toggle`, { is_active });
    }

    async getEmbedCode(id: number): Promise<ApiResponse<{ embed_code: string }>> {
        return super.request<ApiResponse<{ embed_code: string }>>('GET', `/widgets/${id}/embed`);
    }

    async getWidgetAnalytics(id: number, params?: { date_from?: string; date_to?: string; }): Promise<ApiResponse<WidgetAnalytics>> {
        const searchParams = new URLSearchParams();
        if (params?.date_from) searchParams.append("date_from", params.date_from);
        if (params?.date_to) searchParams.append("date_to", params.date_to);
        const query = searchParams.toString();
        return super.request<ApiResponse<WidgetAnalytics>>(
            'GET',
            `/widgets/${id}/analytics${query ? `?${query}` : ""}`
        );
    }

    async duplicateWidget(id: number, name: string): Promise<ApiResponse<WidgetApiData>> {
        return super.request<ApiResponse<WidgetApiData>>('POST', `/widgets/${id}/duplicate`, { name });
    }

    async exportWidget(id: number): Promise<Blob> {
        const response = await api.get(`/api/widgets/${id}/export`, { responseType: 'blob' });
        return response.data;
    }

    async importWidget(file: File): Promise<ApiResponse<WidgetApiData>> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/api/widgets/import`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    }

    async validateConfig(data: WidgetApiData): Promise<ApiResponse<any>> {
        return super.request<ApiResponse<any>>('POST', '/widgets/validate', data);
    }

    async testWidget(data: WidgetApiData): Promise<ApiResponse<any>> {
        return super.request<ApiResponse<any>>('POST', '/widgets/test', data);
    }
}

export const widgetApi = new WidgetApiClient(); 