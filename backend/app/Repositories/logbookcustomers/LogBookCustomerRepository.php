<?php

namespace App\Repositories\logbookcustomers;

use App\Models\logbookcustomers\LogBookCustomer;
use App\Enums\logbookcustomers\LogBookCustomerStatusEnum;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class LogBookCustomerRepository
{
    public function getAll(string $search = null, string $startDate = null, string $endDate = null, bool $all = false): LengthAwarePaginator
    {
        $query = DB::table('tb_log_book_customers as a')
            ->join('m_customers as b', 'a.id_customers', '=', 'b.id_customers')
            ->join('m_users as c', 'a.username', '=', 'c.username')
            ->select('a.*', 'b.nm_customers', 'c.nm_users')
            ->where('a.status_log_book', LogBookCustomerStatusEnum::LOG_BOOK->value);

        if (!$all) {
            $startDate = $startDate ?? date('Y-m-01');
            $endDate = $endDate ?? date('Y-m-d');
            $query->whereBetween('a.date_log_book', [$startDate, $endDate]);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $terms = explode(',', $search);
                foreach ($terms as $term) {
                    $q->orWhere('b.nm_customers', 'like', "%{$term}%")
                      ->orWhere('c.nm_users', 'like', "%{$term}%");
                }
            });
        }

        return $query->orderBy('a.id_log_book', 'DESC')->paginate(10);
    }

    public function getById(string $idLogBook)
    {
        return DB::table('tb_log_book_customers as a')
            ->join('m_customers as b', 'a.id_customers', '=', 'b.id_customers')
            ->join('m_users as c', 'a.username', '=', 'c.username')
            ->select('a.*', 'b.nm_customers', 'c.nm_users')
            ->where('a.id_log_book', $idLogBook)
            ->first();
    }

    public function getCustomers()
    {
        return DB::table('m_customers')
            ->select('id_customers', 'nm_customers', 'customers_address', 'provinsi')
            ->get();
    }
}
