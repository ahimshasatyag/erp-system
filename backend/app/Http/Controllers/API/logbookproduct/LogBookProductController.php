<?php

namespace App\Http\Controllers\API\logbookproduct;

use App\Http\Controllers\Controller;
use App\Http\Requests\logbookproduct\StoreLogBookProductRequest;
use App\Http\Requests\logbookproduct\UpdateLogBookProductRequest;
use App\Http\Resources\logbookproduct\LogBookProductResource;
use App\Models\logbookproduct\LogBookProduct;
use App\Services\logbookproduct\LogBookProductService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class LogBookProductController extends Controller implements HasMiddleware
{
    use AuthorizesRequests;

    public static function middleware(): array
    {
        return [
            new Middleware('can:viewAny,App\Models\logbookproduct\LogBookProduct', only: ['index']),
            new Middleware('can:create,App\Models\logbookproduct\LogBookProduct', only: ['store']),
            new Middleware('can:view,log_book', only: ['show']),
            new Middleware('can:update,log_book', only: ['update']),
            new Middleware('can:delete,log_book', only: ['destroy']),
        ];
    }

    public function __construct(
        protected LogBookProductService $service
    ) {
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $logBooks = $this->service->getPaginated();
        return LogBookProductResource::collection($logBooks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLogBookProductRequest $request): JsonResponse
    {
        $logBook = $this->service->store($request->validated());

        return response()->json([
            'sukses' => true,
            'kode' => $logBook->id_log_book,
            'data' => new LogBookProductResource($logBook)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(LogBookProduct $logBook): LogBookProductResource
    {
        // Eager load relationships if necessary
        $logBook->loadMissing(['product', 'typeKerusakan', 'user']);
        
        return new LogBookProductResource($logBook);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLogBookProductRequest $request, LogBookProduct $logBook): JsonResponse
    {
        $updatedLogBook = $this->service->update($logBook, $request->validated());

        return response()->json([
            'sukses' => true,
            'kode' => $updatedLogBook->id_log_book,
            'data' => new LogBookProductResource($updatedLogBook)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LogBookProduct $logBook): JsonResponse
    {
        $this->service->delete($logBook);

        return response()->json([
            'sukses' => true,
            'message' => 'Log Book entry successfully canceled.'
        ]);
    }
}
