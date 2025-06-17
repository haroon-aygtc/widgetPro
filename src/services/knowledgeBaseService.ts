import React from 'react';
import { knowledgeBaseAPI, DocumentFilters, DocumentUploadOptions, WebsiteCrawlOptions, APIConnectionOptions } from '@/lib/api/knowledgeBaseAPI';
import { KnowledgeBaseDocument, UploadResult, DocumentsResponse, CrawlResult, APIConnectionResult, KnowledgeBaseStats, TestResult } from '@/types/knowledgebase';




class KnowledgeBaseService {
    /**
     * Upload documents to knowledge base
     */
    async uploadDocuments(
        files: FileList | File[],
        options?: {
            chunkSize?: number;
            chunkOverlap?: number;
            autoProcess?: boolean;
        }
    ): Promise<UploadResult> {
        try {
            const uploadOptions: DocumentUploadOptions = {
                chunk_size: options?.chunkSize,
                chunk_overlap: options?.chunkOverlap,
                auto_process: options?.autoProcess,
            };

            const response = await knowledgeBaseAPI.uploadDocuments(files, uploadOptions);

            if (!response.success) {
                throw new Error(response.message || 'Upload failed');
            }

            return response.data as UploadResult;
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Upload failed');
        }
    }

    /**
     * Get user's knowledge base documents
     */
    async getDocuments(options?: {
        page?: number;
        perPage?: number;
        search?: string;
        status?: 'uploaded' | 'processing' | 'processed' | 'failed';
    }): Promise<DocumentsResponse> {
        const params = new URLSearchParams();

        if (options?.page) {
            params.append('page', options.page.toString());
        }
        if (options?.perPage) {
            params.append('per_page', options.perPage.toString());
        }
        if (options?.search) {
            params.append('search', options.search);
        }
        if (options?.status) {
            params.append('status', options.status);
        }

        const response = await knowledgeBaseAPI.getDocuments(params as DocumentFilters);

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch documents');
        }

        return response.data;
    }

    /**
     * Delete a document from knowledge base
     */
    async deleteDocument(documentId: string): Promise<{ success: boolean; message: string }> {
        const response = await knowledgeBaseAPI.deleteDocument(documentId);

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to delete document');
        }

        return response.data;
    }

    /**
     * Crawl website for knowledge base
     */
    async crawlWebsite(options: {
        url: string;
        maxPages?: number;
        maxDepth?: number;
        includePatterns?: string[];
        excludePatterns?: string[];
    }): Promise<CrawlResult> {
        const response = await knowledgeBaseAPI.crawlWebsite({
            url: options.url,
            max_pages: options.maxPages || 10,
            max_depth: options.maxDepth || 2,
            include_patterns: options.includePatterns || [],
            exclude_patterns: options.excludePatterns || [],
        });

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to start website crawling');
        }

        return response.data;
    }

    /**
     * Connect API to knowledge base
     */
    async connectAPI(options: {
        name: string;
        endpoint: string;
        apiKey?: string;
        headers?: Record<string, string>;
        syncInterval?: number;
    }): Promise<APIConnectionResult> {
        const response = await knowledgeBaseAPI.connectAPI({
            name: options.name,
            endpoint: options.endpoint,
            api_key: options.apiKey,
            headers: options.headers || {},
            sync_interval: options.syncInterval || 3600,
        });

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to connect API');
        }

        return response.data;
    }

    /**
     * Test knowledge base with a query
     */
    async testKnowledgeBase(
        query: string,
        maxResults: number = 5
    ): Promise<TestResult> {
        const response = await knowledgeBaseAPI.testKnowledgeBase(query, maxResults);

        if (!response.data.success) {
            throw new Error(response.data.message || 'Knowledge base test failed');
        }

        return response.data;
    }

    /**
     * Get knowledge base statistics
     */
    async getStatistics(): Promise<KnowledgeBaseStats> {
        const response = await knowledgeBaseAPI.getStatistics();

        if (!response.data.success) {
            throw new Error('Failed to fetch knowledge base statistics');
        }

        return response.data.statistics;
    }

    /**
     * Process document (manual trigger)
     */
    async processDocument(documentId: string): Promise<{ success: boolean; message: string }> {
        const response = await knowledgeBaseAPI.processDocument(documentId);

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to process document');
        }

        return response.data;
    }

    /**
     * Get processing status for a document
     */
    async getDocumentStatus(documentId: string): Promise<{
        status: string;
        progress: number;
        chunks_processed: number;
        total_chunks: number;
        error_message?: string;
    }> {
        const response = await knowledgeBaseAPI.getDocumentStatus(documentId);

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to get document status');
        }

        return response.data;
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
    ): Promise<{
        results: Array<{
            content: string;
            source: string;
            score: number;
            metadata: Record<string, any>;
        }>;
        total_results: number;
        query_time: number;
    }> {
        const response = await knowledgeBaseAPI.searchKnowledgeBase(query, options );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Search failed');
        }

        return response.data;
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
    ): Promise<{ success: boolean; message: string }> {
            const response = await knowledgeBaseAPI.updateDocumentSettings(documentId, settings);

        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to update document settings');
        }

        return response.data;
    }
}

// Create singleton instance
export const knowledgeBaseService = new KnowledgeBaseService();

// React hooks for knowledge base operations
export const useKnowledgeBaseDocuments = (options?: {
    page?: number;
    perPage?: number;
    search?: string;
    status?: string;
}) => {
    const [data, setData] = React.useState<DocumentsResponse | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchDocuments = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await knowledgeBaseService.getDocuments(options as DocumentFilters);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch documents');
        } finally {
            setLoading(false);
        }
    }, [options]);

    React.useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    return { data, loading, error, refetch: fetchDocuments };
};

export const useKnowledgeBaseStats = () => {
    const [data, setData] = React.useState<KnowledgeBaseStats | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await knowledgeBaseService.getStatistics();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { data, loading, error };
}; 