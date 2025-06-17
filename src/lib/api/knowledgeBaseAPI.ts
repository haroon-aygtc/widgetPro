import { BaseApiClient } from './config/BaseApiClient'; // BaseApiClient is a wrapper around axios for API requests
import { KnowledgeBaseAPIResponse, DocumentUploadOptions, DocumentFilters, WebsiteCrawlOptions, APIConnectionOptions } from '@/types/knowledgebase';
import { AxiosResponse } from 'axios'; // AxiosResponse is the type for the response from axios requests

class KnowledgeBaseAPI extends BaseApiClient {
    constructor() {
        super();
    }

    /**
     * Upload documents to knowledge base
     */
    async uploadDocuments(
        files: FileList | File[],
        options?: DocumentUploadOptions
    ): Promise<AxiosResponse<KnowledgeBaseAPIResponse>> {
        const formData = new FormData();

        const fileArray = Array.from(files);
        fileArray.forEach(file => {
            formData.append('files[]', file);
        });

        if (options?.chunk_size) {
            formData.append('chunk_size', options.chunk_size.toString());
        }
        if (options?.chunk_overlap) {
            formData.append('chunk_overlap', options.chunk_overlap.toString());
        }
        if (options?.auto_process !== undefined) {
            formData.append('auto_process', options.auto_process.toString());
        }

        return this.post('/knowledge-base/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    /**
     * Get user's knowledge base documents
     */
    async getDocuments(filters?: DocumentFilters): Promise<AxiosResponse<KnowledgeBaseAPIResponse>> {
        const params = new URLSearchParams();

        if (filters?.page) {
            params.append('page', filters.page.toString());
        }
        if (filters?.per_page) {
            params.append('per_page', filters.per_page.toString());
        }
        if (filters?.search) {
            params.append('search', filters.search);
        }
        if (filters?.status) {
            params.append('status', filters.status);
        }

        return this.get(`/knowledge-base/documents?${params.toString()}`);
    }

    /**
     * Delete a document from knowledge base
     */
    async deleteDocument(documentId: string): Promise<AxiosResponse<KnowledgeBaseAPIResponse>> {
        return this.delete(`/knowledge-base/documents/${documentId}`);
    }

    /**
     * Crawl website for knowledge base
     */
    async crawlWebsite(options: WebsiteCrawlOptions): Promise<AxiosResponse<KnowledgeBaseAPIResponse>> {
        return this.post('/knowledge-base/websites/crawl', {
            url: options.url,
            max_pages: options.max_pages || 10,
            max_depth: options.max_depth || 2,
            include_patterns: options.include_patterns || [],
            exclude_patterns: options.exclude_patterns || [],
        });
    }

    /**
     * Connect API to knowledge base
     */
    async connectAPI(options: APIConnectionOptions): Promise<AxiosResponse<KnowledgeBaseAPIResponse>> {
        return this.post('/knowledge-base/apis/connect', {
            name: options.name,
            endpoint: options.endpoint,
            api_key: options.api_key,
            headers: options.headers || {},
            sync_interval: options.sync_interval || 3600,
        });
    }

    /**
     * Test knowledge base with a query
     */
    async testKnowledgeBase(query: string, maxResults: number = 5): Promise<AxiosResponse<KnowledgeBaseAPIResponse>> {
        return this.post('/knowledge-base/test', {
            query,
            max_results: maxResults,
        });
    }

    /**
     * Get knowledge base statistics
     */
    async getStatistics(): Promise<AxiosResponse<KnowledgeBaseAPIResponse>> {
        return this.get('/knowledge-base/statistics');
    }

    /**
     * Process document manually
     */
    async processDocument(documentId: string): Promise<KnowledgeBaseAPIResponse> {
        return this.super.request(`/knowledge-base/documents/${documentId}/process`);
    }

    /**
     * Get document processing status
     */
    async getDocumentStatus(documentId: string): Promise<KnowledgeBaseAPIResponse> {
        return this.get(`/knowledge-base/documents/${documentId}/status`);
    }

    /**
     * Search knowledge base
     */
    async searchKnowledgeBase(
        query: string,
        options?: {
            maxResults?: number;
            minScore?: number;
            documentIds?: string[];
        }
    ): Promise<KnowledgeBaseAPIResponse> {
        return this.post('/knowledge-base/search', {
            query,
            max_results: options?.maxResults || 10,
            min_score: options?.minScore || 0.5,
            document_ids: options?.documentIds || [],
        });
    }

    /**
     * Update document settings
     */
    async updateDocumentSettings(
        documentId: string,
        settings: {
            chunkSize?: number;
            chunkOverlap?: number;
            autoReprocess?: boolean;
        }
    ): Promise<KnowledgeBaseAPIResponse> {
        return this.patch(`/knowledge-base/documents/${documentId}/settings`, settings);
    }
}

export const knowledgeBaseAPI = new KnowledgeBaseAPI(); 