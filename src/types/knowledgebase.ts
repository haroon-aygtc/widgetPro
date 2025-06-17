// Domain types for knowledge base
export interface KnowledgeBaseDocument {
    id: string;
    name: string;
    type: string;
    size: string;
    status: string;
    uploadDate: string;
    chunks: number;
    processed_at?: string;
    error_message?: string;
}

export interface KnowledgeBaseWebsite {
    id: string;
    url: string;
    status: string;
    lastCrawled: string;
    pages: number;
    depth: number;
}

export interface KnowledgeBaseAPI {
    id: string;
    name: string;
    type: string;
    endpoint: string;
    status: string;
    lastSync: string;
}

export interface UploadResult {
    success: boolean;
    message: string;
    uploaded_files: Array<{
        id: string;
        name: string;
        size: string;
        type: string;
        status: string;
    }>;
    errors: Array<{
        file: string;
        error: string;
    }>;
    total_uploaded: number;
    total_errors: number;
}

export interface TestResult {
    success: boolean;
    message: string;
    query: string;
    results_count: number;
    results: Array<{
        content: string;
        source: string;
        chunk_index: number;
        relevance_score: number;
        created_at: string;
    }>;
    test_timestamp: string;
}

export interface KnowledgeBaseStats {
    documents: {
        total: number;
        processed: number;
        processing: number;
        failed: number;
    };
    websites: {
        total: number;
        active: number;
        crawling: number;
    };
    apis: {
        total: number;
        active: number;
        syncing: number;
    };
    chunks: {
        total: number;
    };
    storage: {
        total_size: number;
        formatted_size: string;
    };
}

export interface DocumentsResponse {
    success: boolean;
    documents: KnowledgeBaseDocument[];
    pagination: {
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    stats: {
        total_documents: number;
        processed_documents: number;
        total_chunks: number;
        total_size: string;
    };
}

export interface CrawlResult {
    success: boolean;
    message: string;
    crawl_id: string;
    estimated_time: string;
}

export interface APIConnectionResult {
    success: boolean;
    message: string;
    api_id: string;
    test_result: {
        success: boolean;
        status_code: number;
        response_time: number;
    };
}

export interface KnowledgeBaseAPIResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface DocumentUploadOptions {
    chunk_size?: number;
    chunk_overlap?: number;
    auto_process?: boolean;
}

export interface DocumentFilters {
    page?: number;
    per_page?: number;
    search?: string;
    status?: 'uploaded' | 'processing' | 'processed' | 'failed';
}

export interface WebsiteCrawlOptions {
    url: string;
    max_pages?: number;
    max_depth?: number;
    include_patterns?: string[];
    exclude_patterns?: string[];
}

export interface APIConnectionOptions {
    name: string;
    endpoint: string;
    api_key?: string;
    headers?: Record<string, string>;
    sync_interval?: number;
}
