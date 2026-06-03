<?php

namespace App\Repositories\logbookproduct;

use App\Models\logbookproduct\LogBookProduct;
use Illuminate\Database\Eloquent\Builder;
use App\Enums\logbookproduct\LogBookStatus;

class LogBookProductRepository
{
    /**
     * Get a query builder for the log books for DataTables or Pagination.
     */
    public function getBaseQuery(): Builder
    {
        return LogBookProduct::with(['product', 'user'])
            ->where('status_log_book', LogBookStatus::LOG_BOOK->value)
            ->select('tb_log_book_product.*');
    }

    /**
     * Find a specific log book by ID.
     */
    public function find(int $idLogBook): ?LogBookProduct
    {
        return LogBookProduct::find($idLogBook);
    }

    /**
     * Cancel / Soft Delete a log book.
     */
    public function cancel(LogBookProduct $logBook): bool
    {
        $logBook->status_log_book = LogBookStatus::CANCELED;
        return $logBook->save();
    }
}
