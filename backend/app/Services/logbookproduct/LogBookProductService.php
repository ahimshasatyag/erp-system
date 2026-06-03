<?php

namespace App\Services\logbookproduct;

use App\Actions\logbookproduct\StoreLogBookProductAction;
use App\Actions\logbookproduct\UpdateLogBookProductAction;
use App\Models\logbookproduct\LogBookProduct;
use App\Repositories\logbookproduct\LogBookProductRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class LogBookProductService
{
    public function __construct(
        protected LogBookProductRepository $repository,
        protected StoreLogBookProductAction $storeAction,
        protected UpdateLogBookProductAction $updateAction
    ) {}

    /**
     * Get paginated log books.
     */
    public function getPaginated(int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->getBaseQuery()->paginate($perPage);
    }

    /**
     * Store a new log book.
     */
    public function store(array $data): LogBookProduct
    {
        return $this->storeAction->execute($data);
    }

    /**
     * Update an existing log book.
     */
    public function update(LogBookProduct $logBookProduct, array $data): LogBookProduct
    {
        return $this->updateAction->execute($logBookProduct, $data);
    }

    /**
     * Soft delete / cancel a log book.
     */
    public function delete(LogBookProduct $logBookProduct): bool
    {
        return $this->repository->cancel($logBookProduct);
    }
}
