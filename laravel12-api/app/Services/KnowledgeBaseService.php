<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class KnowledgeBaseService
{
    /**
     * Upload and process documents
     */
    public function uploadDocuments(
        int $userId,
        array $files,
        int $chunkSize = 1024,
        int $chunkOverlap = 200,
        bool $autoProcess = true
    ): array {
        $uploadedFiles = [];
        $errors = [];

        foreach ($files as $file) {
            try {
                $result = $this->processFileUpload($userId, $file, $chunkSize, $chunkOverlap, $autoProcess);
                $uploadedFiles[] = $result;

                if ($autoProcess) {
                    $this->queueDocumentProcessing($result['id']);
                }
            } catch (\Exception $e) {
                $errors[] = [
                    'file' => $file->getClientOriginalName(),
                    'error' => $e->getMessage()
                ];
            }
        }

        return [
            'success' => true,
            'message' => count($uploadedFiles) . ' file(s) uploaded successfully',
            'uploaded_files' => $uploadedFiles,
            'errors' => $errors,
            'total_uploaded' => count($uploadedFiles),
            'total_errors' => count($errors),
        ];
    }

    /**
     * Get user's documents with filtering and pagination
     */
    public function getUserDocuments(
        int $userId,
        int $page = 1,
        int $perPage = 20,
        ?string $search = null,
        ?string $status = null
    ): array {
        $query = DB::table('knowledge_base_documents')
            ->where('user_id', $userId)
            ->whereNull('deleted_at');

        if ($search) {
            $query->where('name', 'LIKE', "%{$search}%");
        }

        if ($status) {
            $query->where('status', $status);
        }

        $total = $query->count();
        $offset = ($page - 1) * $perPage;

        $documents = $query
            ->orderBy('created_at', 'desc')
            ->offset($offset)
            ->limit($perPage)
            ->get();

        $formattedDocuments = $documents->map(function ($doc) {
            return $this->formatDocument($doc);
        })->toArray();

        $stats = $this->getUserDocumentStats($userId);

        return [
            'success' => true,
            'documents' => $formattedDocuments,
            'pagination' => [
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $page,
                'last_page' => ceil($total / $perPage),
            ],
            'stats' => $stats,
        ];
    }

    /**
     * Delete a document
     */
    public function deleteDocument(int $userId, int $documentId): array
    {
        $document = DB::table('knowledge_base_documents')
            ->where('id', $documentId)
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->first();

        if (!$document) {
            throw new \Exception('Document not found');
        }

        DB::transaction(function () use ($documentId, $document) {
            // Soft delete document
            DB::table('knowledge_base_documents')
                ->where('id', $documentId)
                ->update([
                    'deleted_at' => now(),
                    'updated_at' => now(),
                ]);

            // Delete associated chunks
            DB::table('knowledge_base_chunks')
                ->where('document_id', $documentId)
                ->delete();

            // Delete physical file
            if (Storage::exists($document->file_path)) {
                Storage::delete($document->file_path);
            }
        });

        return [
            'success' => true,
            'message' => 'Document deleted successfully'
        ];
    }

    /**
     * Crawl website for content
     */
    public function crawlWebsite(
        int $userId,
        string $url,
        int $maxPages = 10,
        int $maxDepth = 2,
        array $includePatterns = [],
        array $excludePatterns = []
    ): array {
        $crawlId = DB::table('knowledge_base_websites')->insertGetId([
            'user_id' => $userId,
            'url' => $url,
            'max_pages' => $maxPages,
            'max_depth' => $maxDepth,
            'include_patterns' => json_encode($includePatterns),
            'exclude_patterns' => json_encode($excludePatterns),
            'status' => 'crawling',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Queue crawling job
        $this->queueWebsiteCrawling($crawlId);

        return [
            'success' => true,
            'message' => 'Website crawling started',
            'crawl_id' => $crawlId,
            'estimated_time' => '2-5 minutes for ' . $maxPages . ' pages',
        ];
    }

    /**
     * Connect external API
     */
    public function connectAPI(
        int $userId,
        string $name,
        string $endpoint,
        ?string $apiKey = null,
        array $headers = [],
        int $syncInterval = 3600
    ): array {
        // Test API connection first
        $testResult = $this->testAPIConnection($endpoint, $apiKey, $headers);

        if (!$testResult['success']) {
            throw new \Exception('API connection test failed: ' . $testResult['error']);
        }

        $apiId = DB::table('knowledge_base_apis')->insertGetId([
            'user_id' => $userId,
            'name' => $name,
            'endpoint' => $endpoint,
            'api_key' => $apiKey ? encrypt($apiKey) : null,
            'headers' => json_encode($headers),
            'sync_interval' => $syncInterval,
            'status' => 'active',
            'last_sync' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Queue initial sync
        $this->queueAPISync($apiId);

        return [
            'success' => true,
            'message' => 'API connected successfully',
            'api_id' => $apiId,
            'test_result' => $testResult,
        ];
    }

    /**
     * Test knowledge base with a query
     */
    public function testKnowledgeBase(int $userId, string $query, int $maxResults = 5): array
    {
        // Check if user has processed documents
        $hasDocuments = DB::table('knowledge_base_documents')
            ->where('user_id', $userId)
            ->where('status', 'processed')
            ->exists();

        if (!$hasDocuments) {
            return [
                'success' => false,
                'message' => 'No processed documents found. Please upload and process documents first.',
                'query' => $query,
                'results_count' => 0,
                'results' => [],
                'test_timestamp' => now()->toISOString(),
            ];
        }

        // Perform semantic search
        $results = $this->performSemanticSearch($userId, $query, $maxResults);

        // Log the test query
        DB::table('knowledge_base_queries')->insert([
            'user_id' => $userId,
            'query' => $query,
            'results_count' => count($results),
            'created_at' => now(),
        ]);

        return [
            'success' => true,
            'message' => 'Knowledge base test completed successfully',
            'query' => $query,
            'results_count' => count($results),
            'results' => $results,
            'test_timestamp' => now()->toISOString(),
        ];
    }

    /**
     * Get comprehensive statistics
     */
    public function getStatistics(int $userId): array
    {
        return [
            'success' => true,
            'statistics' => [
                'documents' => $this->getDocumentStats($userId),
                'websites' => $this->getWebsiteStats($userId),
                'apis' => $this->getAPIStats($userId),
                'chunks' => $this->getChunkStats($userId),
                'storage' => $this->getStorageStats($userId),
            ],
        ];
    }

    // Private helper methods

    private function processFileUpload(
        int $userId,
        UploadedFile $file,
        int $chunkSize,
        int $chunkOverlap,
        bool $autoProcess
    ): array {
        $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('knowledge-base/' . $userId, $filename, 'local');

        $documentId = DB::table('knowledge_base_documents')->insertGetId([
            'user_id' => $userId,
            'name' => $file->getClientOriginalName(),
            'filename' => $filename,
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'status' => $autoProcess ? 'processing' : 'uploaded',
            'chunk_size' => $chunkSize,
            'chunk_overlap' => $chunkOverlap,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return [
            'id' => $documentId,
            'name' => $file->getClientOriginalName(),
            'size' => $this->formatFileSize($file->getSize()),
            'type' => $file->getClientOriginalExtension(),
            'status' => $autoProcess ? 'processing' : 'uploaded',
        ];
    }

    private function formatDocument($doc): array
    {
        return [
            'id' => $doc->id,
            'name' => $doc->name,
            'type' => pathinfo($doc->name, PATHINFO_EXTENSION),
            'size' => $this->formatFileSize($doc->file_size),
            'status' => ucfirst($doc->status),
            'uploadDate' => Carbon::parse($doc->created_at)->format('M j, Y'),
            'chunks' => $doc->total_chunks ?? 0,
            'processed_at' => $doc->processed_at ? Carbon::parse($doc->processed_at)->diffForHumans() : null,
            'error_message' => $doc->error_message,
        ];
    }

    private function getUserDocumentStats(int $userId): array
    {
        return [
            'total_documents' => DB::table('knowledge_base_documents')
                ->where('user_id', $userId)
                ->whereNull('deleted_at')
                ->count(),
            'processed_documents' => DB::table('knowledge_base_documents')
                ->where('user_id', $userId)
                ->where('status', 'processed')
                ->count(),
            'total_chunks' => DB::table('knowledge_base_chunks')
                ->where('user_id', $userId)
                ->count(),
            'total_size' => $this->formatFileSize(
                DB::table('knowledge_base_documents')
                    ->where('user_id', $userId)
                    ->whereNull('deleted_at')
                    ->sum('file_size')
            ),
        ];
    }

    private function performSemanticSearch(int $userId, string $query, int $maxResults): array
    {
        // Simple text search implementation
        // In production, this would use vector search or advanced search engines
        $chunks = DB::table('knowledge_base_chunks')
            ->join('knowledge_base_documents', 'knowledge_base_chunks.document_id', '=', 'knowledge_base_documents.id')
            ->select([
                'knowledge_base_chunks.content',
                'knowledge_base_chunks.chunk_index',
                'knowledge_base_documents.name as document_name',
                'knowledge_base_chunks.created_at',
            ])
            ->where('knowledge_base_chunks.user_id', $userId)
            ->where('knowledge_base_chunks.content', 'LIKE', "%{$query}%")
            ->orderBy('knowledge_base_chunks.created_at', 'desc')
            ->limit($maxResults)
            ->get();

        return $chunks->map(function ($chunk) {
            return [
                'content' => substr($chunk->content, 0, 200) . (strlen($chunk->content) > 200 ? '...' : ''),
                'source' => $chunk->document_name,
                'chunk_index' => $chunk->chunk_index,
                'relevance_score' => 0.85, // Placeholder score
                'created_at' => Carbon::parse($chunk->created_at)->diffForHumans(),
            ];
        })->toArray();
    }

    private function testAPIConnection(string $endpoint, ?string $apiKey, array $headers): array
    {
        try {
            $client = new \GuzzleHttp\Client(['timeout' => 10]);

            $requestHeaders = $headers;
            if ($apiKey) {
                $requestHeaders['Authorization'] = 'Bearer ' . $apiKey;
            }

            $response = $client->get($endpoint, [
                'headers' => $requestHeaders,
            ]);

            return [
                'success' => true,
                'status_code' => $response->getStatusCode(),
                'response_time' => 0, // Would measure actual response time
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    private function getDocumentStats(int $userId): array
    {
        return [
            'total' => DB::table('knowledge_base_documents')
                ->where('user_id', $userId)
                ->whereNull('deleted_at')
                ->count(),
            'processed' => DB::table('knowledge_base_documents')
                ->where('user_id', $userId)
                ->where('status', 'processed')
                ->count(),
            'processing' => DB::table('knowledge_base_documents')
                ->where('user_id', $userId)
                ->where('status', 'processing')
                ->count(),
            'failed' => DB::table('knowledge_base_documents')
                ->where('user_id', $userId)
                ->where('status', 'failed')
                ->count(),
        ];
    }

    private function getWebsiteStats(int $userId): array
    {
        return [
            'total' => DB::table('knowledge_base_websites')->where('user_id', $userId)->count(),
            'active' => DB::table('knowledge_base_websites')->where('user_id', $userId)->where('status', 'completed')->count(),
            'crawling' => DB::table('knowledge_base_websites')->where('user_id', $userId)->where('status', 'crawling')->count(),
        ];
    }

    private function getAPIStats(int $userId): array
    {
        return [
            'total' => DB::table('knowledge_base_apis')->where('user_id', $userId)->count(),
            'active' => DB::table('knowledge_base_apis')->where('user_id', $userId)->where('status', 'active')->count(),
            'syncing' => DB::table('knowledge_base_apis')->where('user_id', $userId)->where('status', 'syncing')->count(),
        ];
    }

    private function getChunkStats(int $userId): array
    {
        return [
            'total' => DB::table('knowledge_base_chunks')->where('user_id', $userId)->count(),
        ];
    }

    private function getStorageStats(int $userId): array
    {
        $totalSize = DB::table('knowledge_base_documents')
            ->where('user_id', $userId)
            ->whereNull('deleted_at')
            ->sum('file_size');

        return [
            'total_size' => $totalSize,
            'formatted_size' => $this->formatFileSize($totalSize),
        ];
    }

    private function formatFileSize(int $bytes): string
    {
        if ($bytes === 0) return '0 B';

        $units = ['B', 'KB', 'MB', 'GB'];
        $i = floor(log($bytes, 1024));

        return round($bytes / pow(1024, $i), 2) . ' ' . $units[$i];
    }

    private function queueDocumentProcessing(int $documentId): void
    {
        // In production, dispatch a job: ProcessDocumentJob::dispatch($documentId);
        // For now, just update status
        DB::table('knowledge_base_documents')
            ->where('id', $documentId)
            ->update([
                'status' => 'processing',
                'updated_at' => now(),
            ]);
    }

    private function queueWebsiteCrawling(int $crawlId): void
    {
        // In production: CrawlWebsiteJob::dispatch($crawlId);
    }

    private function queueAPISync(int $apiId): void
    {
        // In production: SyncAPIJob::dispatch($apiId);
    }
}
