import axios from "@/lib/api/config/axios";

export class BaseApiClient {
    protected async request<T>(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        endpoint: string,
        data?: any,
        config: any = {}
    ): Promise<T> {
        const response = await axios.request({
            method,
            url: `/api${endpoint}`,
            data,
            ...config,
        });
        return response.data;
    }
} 