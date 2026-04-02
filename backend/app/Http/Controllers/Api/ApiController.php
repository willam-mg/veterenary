<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

abstract class ApiController extends Controller
{
    protected function success(mixed $data = null, string $message = 'OK', int $status = Response::HTTP_OK): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    protected function error(string $message, array $errors = [], int $status = Response::HTTP_UNPROCESSABLE_ENTITY): JsonResponse
    {
        return response()->json([
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    protected function paginatedResponse(LengthAwarePaginator $paginator, mixed $items, string $message = 'OK'): JsonResponse
    {
        return $this->success([
            'items' => $items,
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
                'has_more_pages' => $paginator->hasMorePages(),
            ],
        ], $message);
    }

    protected function applyTokenizedLikeSearch(Builder $query, array $columns, string $search): void
    {
        $terms = preg_split('/\s+/', trim($search)) ?: [];

        foreach (array_filter($terms) as $term) {
            $query->where(function (Builder $innerQuery) use ($columns, $term): void {
                foreach ($columns as $index => $column) {
                    if ($index === 0) {
                        $innerQuery->where($column, 'like', "%{$term}%");
                        continue;
                    }

                    $innerQuery->orWhere($column, 'like', "%{$term}%");
                }
            });
        }
    }
}
