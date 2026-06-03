<?php

namespace App\Actions\logbookcustomers;

use App\Models\logbookcustomers\LogBookCustomer;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UpdateLogBookCustomerAction
{
    public function execute(string $idLogBook, array $data): bool
    {
        return DB::transaction(function () use ($idLogBook, $data) {
            $updateData = [
                'id_customers' => $data['id_customers'],
                'date_log_book' => Carbon::parse($data['date_log_book'])->format('Y-m-d'),
                'masalah' => htmlspecialchars($data['masalah_hidden'] ?? ''),
                'solusi' => htmlspecialchars($data['solusi_hidden'] ?? ''),
                'catatan' => htmlspecialchars($data['catatan_hidden'] ?? ''),
            ];

            return LogBookCustomer::where('id_log_book', $idLogBook)->update($updateData) > 0;
        });
    }
}
