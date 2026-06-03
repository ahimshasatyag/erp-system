<?php

namespace App\Actions\logbookcustomers;

use App\Models\logbookcustomers\LogBookCustomer;
use App\Enums\logbookcustomers\LogBookCustomerStatusEnum;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CreateLogBookCustomerAction
{
    public function execute(array $data, string $username): LogBookCustomer
    {
        return DB::transaction(function () use ($data, $username) {
            $logBook = LogBookCustomer::create([
                'id_customers' => $data['id_customers'],
                'date_log_book' => Carbon::parse($data['date_log_book'])->format('Y-m-d'),
                'masalah' => htmlspecialchars($data['masalah_hidden'] ?? ''),
                'solusi' => htmlspecialchars($data['solusi_hidden'] ?? ''),
                'catatan' => htmlspecialchars($data['catatan_hidden'] ?? ''),
                'username' => $username,
                'status_log_book' => LogBookCustomerStatusEnum::LOG_BOOK->value
            ]);

            return $logBook;
        });
    }
}
