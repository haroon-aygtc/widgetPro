<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;

class KnowledgeBaseController extends Controller
{
    /**
     * Upload documents to knowledge base
     */
    public function uploadDocuments(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'files' => 'required|array|min:1',
            'files.*' => 'required|file|mimes:pdf,docx,txt,csv|max:10240', // 10MB max
            'chunk_size' => 'sometimes|integer|min:256|max:4096',
            'chunk_overlap' => 'sometimes|integer|min:50|max:500',
            'auto_process' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $userId = auth()->id();
        $chunkSize = $request->get('chunk_size', 1024);
        $chunkOverlap = $request->get('chunk_overlap', 200);
        $autoProcess = $request->get('auto_process', true);

        $uploadedFiles = [];
        $errors = [];

        foreach ($request->file('files') as $file) {
            try {
                // Store file
                $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('knowledge-base/' . $userId, $filename, 'local');

                // Create database record
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

                $uploadedFiles[] = [
                    'id' => $documentId,
                    'name' => $file->getClientOriginalName(),
                    'size' => $this->formatFileSize($file->getSize()),
                    'type' => $file->getClientOriginalExtension(),
                    'status' => $autoProcess ? 'processing' : 'uploaded',
                ];

                // Queue processing if auto-process is enabled
                if ($autoProcess) {
                    $this->queueDocumentProcessing($documentId);
                }

            } catch (\Exception $e) {
                $errors[] = [
                    'file' => $file->getClientOriginalName(),
                    'error' => $e->getMessage()
                ];
            }
        }

        return response()->json([
            'success' => true,
            'message' => count($uploadedFiles) . ' file(s) uploaded successfully',
            'uploaded_files' => $uploadedFiles,
            'errors' => $errors,
            'total_uploaded' => count($uploadedFiles),
            'total_errors' => count($errors),
        ]);
    }

    /**
     * Get user's knowledge base documents
     */
    public function getDocuments(Request $request): JsonResponse
    {
        $request->validate([
            'page' => 'sometimes|integer|min:1',
            'per_page' => 'sometimes|integer|min:1|max:100',
            'search' => 'sometimes|string|max:255',
            'status' => 'sometimes|string|in:uploaded,processing,processed,failed',
        ]);

        $userId = auth()->id();
        $perPage = $request->get('per_page', 20);
        $search = $request->get('search');
        $status = $request->get('status');

        $query = DB::table('knowledge_base_documents')
            ->where('user_id', $userId)
            ->where('deleted_at', null);

        if ($search) {
            $query->where('name', 'LIKE', "%{$search}%");
        }

        if ($status) {
            $query->where('status', $status);
        }

        $total = $query->count();
        $documents = $query
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->items();

        // Format documents
        $formattedDocuments = array_map(function ($doc) {
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
        }, $documents);

        // Get summary statistics
        $stats = [
            'total_documents' => DB::table('knowledge_base_documents')->where('user_id', $userId)->where('deleted_at', null)->count(),
            'processed_documents' => DB::table('knowledge_base_documents')->where('user_id', $userId)->where('status', 'processed')->count(),
            'total_chunks' => DB::table('knowledge_base_chunks')->where('user_id', $userId)->count(),
            'total_size' => DB::table('knowledge_base_documents')->where('user_id', $userId)->where('deleted_at', null)->sum('file_size'),
        ];

        return response()->json([
            'success' => true,
            'documents' => $formattedDocuments,
            'pagination' => [
                'total' => $total,
                'per_page' => $perPage,
                'current_page' => $request->get('page', 1),
                'last_page' => ceil($total / $perPage),
            ],
            'stats' => [
                'total_documents' => $stats['total_documents'],
                'processed_documents' => $stats['processed_documents'],
                'total_chunks' => $stats['total_chunks'],
                'total_size' => $this->formatFileSize($stats['total_size']),
            ],
        ]);
    }

    /**
     * Delete a document from knowledge base
     */
    public function deleteDocument(Request $request, int $documentId): JsonResponse
    {
        $userId = auth()->id();

        $document = DB::table('knowledge_base_documents')
            ->where('id', $documentId)
            ->where('user_id', $userId)
            ->where('deleted_at', null)
            ->first();

        if (!$document) {
            return response()->json([
                'success' => false,
                'message' => 'Document not found'
            ], 404);
        }

        try {
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

            return response()->json([
                'success' => true,
                'message' => 'Document deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete document: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crawl website for knowledge base
     */
    public function crawlWebsite(Request $request): JsonResponse
    {
        $request->validate([
            'url' => 'required|url|max:2048',
            'max_pages' => 'sometimes|integer|min:1|max:100',
            'max_depth' => 'sometimes|integer|min:1|max:5',
            'include_patterns' => 'sometimes|array',
            'exclude_patterns' => 'sometimes|array',
        ]);

        $userId = auth()->id();
        $url = $request->get('url');
        $maxPages = $request->get('max_pages', 10);
        $maxDepth = $request->get('max_depth', 2);

        try {
            // Create website crawl record
            $crawlId = DB::table('knowledge_base_websites')->insertGetId([
                'user_id' => $userId,
                'url' => $url,
                'max_pages' => $maxPages,
                'max_depth' => $maxDepth,
                'status' => 'crawling',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Queue website crawling job
            $this->queueWebsiteCrawling($crawlId);

            return response()->json([
                'success' => true,
                'message' => 'Website crawling started',
                'crawl_id' => $crawlId,
                'estimated_time' => '2-5 minutes for ' . $maxPages . ' pages',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to start website crawling: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Connect API to knowledge base
     */
    public function connectAPI(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'endpoint' => 'required|url|max:2048',
            'api_key' => 'sometimes|string|max:512',
            'headers' => 'sometimes|array',
            'sync_interval' => 'sometimes|integer|min:60|max:86400', // 1 minute to 24 hours
        ]);

        $userId = auth()->id();

        try {
            // Test API connection first
            $testResult = $this->testAPIConnection(
                $request->get('endpoint'),
                $request->get('api_key'),
                $request->get('headers', [])
            );

            if (!$testResult['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'API connection test failed: ' . $testResult['error']
                ], 400);
            }

            // Create API connection record
            $apiId = DB::table('knowledge_base_apis')->insertGetId([
                'user_id' => $userId,
                'name' => $request->get('name'),
                'endpoint' => $request->get('endpoint'),
                'api_key' => $request->get('api_key') ? encrypt($request->get('api_key')) : null,
                'headers' => json_encode($request->get('headers', [])),
                'sync_interval' => $request->get('sync_interval', 3600),
                'status' => 'active',
                'last_sync' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Queue initial sync
            $this->queueAPISync($apiId);

            return response()->json([
                'success' => true,
                'message' => 'API connected successfully',
                'api_id' => $apiId,
                'test_result' => $testResult,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to connect API: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Test knowledge base with a query
     */
    public function testKnowledgeBase(Request $request): JsonResponse
    {
        $request->validate([
            'query' => 'required|string|min:3|max:500',
            'max_results' => 'sometimes|integer|min:1|max:20',
        ]);

        $userId = auth()->id();
        $query = $request->get('query');
        $maxResults = $request->get('max_results', 5);

        try {
            // Check if user has any processed documents
            $hasDocuments = DB::table('knowledge_base_documents')
                ->where('user_id', $userId)
                ->where('status', 'processed')
                ->exists();

            if (!$hasDocuments) {
                return response()->json([
                    'success' => false,
                    'message' => 'No processed documents found. Please upload and process documents first.',
                    'results' => [],
                ]);
            }

            // Perform semantic search on knowledge base chunks
            $results = $this->performSemanticSearch($userId, $query, $maxResults);

            // Log the test query for analytics
            DB::table('knowledge_base_queries')->insert([
                'user_id' => $userId,
                'query' => $query,
                'results_count' => count($results),
                'created_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Knowledge base test completed successfully',
                'query' => $query,
                'results_count' => count($results),
                'results' => $results,
                'test_timestamp' => now()->toISOString(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Knowledge base test failed: ' . $e->getMessage(),
                'results' => [],
            ], 500);
        }
    }

    /**
     * Get knowledge base statistics
     */
    public function getStatistics(): JsonResponse
    {
        $userId = auth()->id();

        $stats = [
            'documents' => [
                'total' => DB::table('knowledge_base_documents')->where('user_id', $userId)->where('deleted_at', null)->count(),
                'processed' => DB::table('knowledge_base_documents')->where('user_id', $userId)->where('status', 'processed')->count(),
                'processing' => DB::table('knowledge_base_documents')->where('user_id', $userId)->where('status', 'processing')->count(),
                'failed' => DB::table('knowledge_base_documents')->where('user_id', $userId)->where('status', 'failed')->count(),
            ],
            'websites' => [
                'total' => DB::table('knowledge_base_websites')->where('user_id', $userId)->count(),
                'active' => DB::table('knowledge_base_websites')->where('user_id', $userId)->where('status', 'completed')->count(),
                'crawling' => DB::table('knowledge_base_websites')->where('user_id', $userId)->where('status', 'crawling')->count(),
            ],
            'apis' => [
                'total' => DB::table('knowledge_base_apis')->where('user_id', $userId)->count(),
                'active' => DB::table('knowledge_base_apis')->where('user_id', $userId)->where('status', 'active')->count(),
                'syncing' => DB::table('knowledge_base_apis')->where('user_id', $userId)->where('status', 'syncing')->count(),
            ],
            'chunks' => [
                'total' => DB::table('knowledge_base_chunks')->where('user_id', $userId)->count(),
            ],
            'storage' => [
                'total_size' => DB::table('knowledge_base_documents')->where('user_id', $userId)->where('deleted_at', null)->sum('file_size'),
                'formatted_size' => $this->formatFileSize(
                    DB::table('knowledge_base_documents')->where('user_id', $userId)->where('deleted_at', null)->sum('file_size')
                ),
            ],
        ];

        return response()->json([
            'success' => true,
            'statistics' => $stats,
        ]);
    }

    // Helper methods

    private function formatFileSize(int $bytes): string
    {
        if ($bytes === 0) return '0 B';

        $units = ['B', 'KB', 'MB', 'GB'];
        $i = floor(log($bytes, 1024));

        return round($bytes / pow(1024, $i), 2) . ' ' . $units[$i];
    }

    private function queueDocumentProcessing(int $documentId): void
    {
        // Queue job for document processing
        // This would typically dispatch a job to process the document
        // For now, we'll just update the status

        // In a real implementation, you would:
        // ProcessDocumentJob::dispatch($documentId);

        // Placeholder: Update status after a delay (in real app, this would be handled by the job)
        DB::table('knowledge_base_documents')
            ->where('id', $documentId)
            ->update([
                'status' => 'processing',
                'updated_at' => now(),
            ]);
    }

    private function queueWebsiteCrawling(int $crawlId): void
    {
        // Queue job for website crawling
        // CrawlWebsiteJob::dispatch($crawlId);
    }

    private function queueAPISync(int $apiId): void
    {
        // Queue job for API synchronization
        // SyncAPIJob::dispatch($apiId);
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

    private function performSemanticSearch(int $userId, string $query, int $maxResults): array
    {
        // In a real implementation, this would use vector search or full-text search
        // For now, we'll do a simple text search

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
}
