<?php

namespace App\Actions\logbookcustomers;

use App\Models\logbookcustomers\LogBookCustomer;
use App\Enums\logbookcustomers\LogBookCustomerStatusEnum;
use Illuminate\Support\Facades\DB;

class DeleteLogBookCustomerAction
{
    public function execute(string $idLogBook): bool
    {
        return DB::transaction(function () use ($idLogBook) {
            return LogBookCustomer::where('id_log_book', $idLogBook)->update([
                'status_log_book' => LogBookCustomerStatusEnum::CANCELED->value,
            ]) > 0;
        });
    }
}
