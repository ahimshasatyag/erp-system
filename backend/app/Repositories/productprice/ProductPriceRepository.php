<?php

namespace App\Repositories\productprice;

use App\Models\productprice\ProductPrice;
use App\Models\productprice\ProductPriceHistory;
use App\Models\products\ProductPriceOpt;
use App\Models\products\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductPriceRepository implements ProductPriceRepositoryInterface
{
    public function getDatatable(Request $request)
    {
        $kurs = 15000; // placeholder, should use pembulatan_kurs(kurs_usd()) helper later
        if(function_exists('kurs_usd') && function_exists('pembulatan_kurs')){
            $kurs = pembulatan_kurs(kurs_usd());
        }

        // Logic mapped exactly from Mmaster.php getDatatable()
        // We will build this using query builder or eloquent since it's a very complex union query in CI.
        // To simplify, we can use DB::select with bindings and wrap it.
        $query = "select
        x.id_product,
        z.code_product,
        z.nm_product,
        xx.nm_product_brand,
        x.product_price,
        x.product_price_agent,
        y.waktu,
        x.aksi,
        x.flag_active,
        ? as kurs_bank
    from
        (
            select
                a.id_product,
                a.product_price,
                a.product_price_agent,
                a.flag_active,
                'NEW' as aksi
            from
                m_product_price a
            where
                a.id_product in(
                    select
                        id_product
                    from
                        m_product_price_history mpph
                    where
                        DATE(waktu) in (
                            select
                                x.updatee
                            from
                                (
                                    select
                                        DATE(waktu) as updatee
                                    from
                                        m_product_price_history
                                    where
                                        status = '3.Baru'
                                    group by
                                        DATE(waktu)
                                    order by
                                        DATE(waktu) desc
                                    limit 1
                                ) as x
                        )
                        and status = '3.Baru'
                )
                and a.id_product not in (
                select
                        id_product
                    from
                        m_product_price_history mpph
                    where
                        DATE(waktu) in (
                            select
                                x.updatee
                            from
                                (
                                    select
                                        DATE(waktu) as updatee
                                    from
                                        m_product_price_history
                                    where
                                        status = '1.Asal'
                                    group by
                                        DATE(waktu)
                                    order by
                                        DATE(waktu) desc
                                    limit 1
                                ) as x
                        )
                        and status = '1.Asal'
                        )
        union ALL
            select
                a.id_product,
                a.product_price,
                a.product_price_agent,
                a.flag_active,
                'UPDATE' as aksi
            from
                m_product_price a
            where
                a.id_product in(
                    select
                        id_product
                    from
                        m_product_price_history mpph
                    where
                        DATE(waktu) in (
                            select
                                x.updatee
                            from
                                (
                                    select
                                        DATE(waktu) as updatee
                                    from
                                        m_product_price_history
                                    where
                                        status = '1.Asal'
                                    group by
                                        DATE(waktu)
                                    order by
                                        DATE(waktu) desc
                                    limit 1
                                ) as x
                        )
                        and status = '1.Asal'
                )
        UNION ALL
            select
                a.id_product,
                a.product_price,
                a.product_price_agent,
                a.flag_active,
                '' as aksi
            from
                m_product_price a
            where
                a.id_product not in(
                    select
                        x.id_product
                    from
                        (
                            select
                                a.id_product
                            from
                                m_product_price a
                            where
                                a.id_product in(
                                    select
                                        id_product
                                    from
                                        m_product_price_history mpph
                                    where
                                        DATE(waktu) in (
                                            select
                                                x.updatee
                                            from
                                                (
                                                    select
                                                        DATE(waktu) as updatee
                                                    from
                                                        m_product_price_history
                                                    where
                                                        status = '3.Baru'
                                                    group by
                                                        DATE(waktu)
                                                    order by
                                                        DATE(waktu) desc
                                                    limit 1
                                                ) as x
                                        )
                                        and status = '3.Baru'
                                )
                        union ALL
                            select
                                a.id_product
                            from
                                m_product_price a
                            where
                                a.id_product in(
                                    select
                                        id_product
                                    from
                                        m_product_price_history mpph
                                    where
                                        DATE(waktu) in (
                                            select
                                                x.updatee
                                            from
                                                (
                                                    select
                                                        DATE(waktu) as updatee
                                                    from
                                                        m_product_price_history
                                                    where
                                                        status = '1.Asal'
                                                    group by
                                                        DATE(waktu)
                                                    order by
                                                        DATE(waktu) desc
                                                    limit 1
                                                ) as x
                                        )
                                        and status = '1.Asal'
                                )
                        ) as x
                )
        ) as x
    INNER join m_product z on
        (
            x.id_product = z.id_product
        )
    inner join m_product_brand xx on
        (
            xx.id_product_brand = z.id_product_brand
        )
        left join (
        select max(waktu) as waktu, id_product from m_product_price_history
GROUP  by id_product
order by max(waktu) DESC
        ) y on y.id_product = x.id_product
				where x.flag_active = 1
    order by
        x.aksi desc";

        $results = DB::select($query, [$kurs]);
        $collection = collect($results);

        // Filter / Search
        if ($request->has('search.value') && !empty($request->input('search.value'))) {
            $searchValue = strtoupper($request->input('search.value'));
            $words = explode(',', $searchValue);
            
            $collection = $collection->filter(function($item) use ($words) {
                foreach($words as $word) {
                    $word = trim($word);
                    if(
                        str_contains(strtoupper($item->code_product ?? ''), $word) ||
                        str_contains(strtoupper($item->nm_product ?? ''), $word) ||
                        str_contains(strtoupper($item->nm_product_brand ?? ''), $word)
                    ) {
                        return true;
                    }
                }
                return false;
            });
        }

        // Sorting
        $sortBy = $request->input('sort_by');
        $sortDir = $request->input('sort_dir', 'desc');
        if ($sortBy) {
            $collection = $sortDir === 'asc' ? $collection->sortBy($sortBy) : $collection->sortByDesc($sortBy);
        }

        // Pagination
        $length = (int) $request->input('length', 10);
        $page = (int) $request->input('page', 1);
        
        if (!$request->has('page') && $request->has('start')) {
            $start = (int) $request->input('start');
            $page = floor($start / $length) + 1;
        }

        $total = $collection->count();
        $items = $collection->slice(($page - 1) * $length, $length)->values();

        return new LengthAwarePaginator(
            $items,
            $total,
            $length,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );
    }

    public function getAvailableProducts()
    {
        return DB::table('m_product')
            ->where('flag_active', 1)
            ->whereNotIn('id_product', function($query) {
                $query->select('id_product')->from('m_product_price');
            })->get();
    }

    public function findById($id)
    {
        $kurs = 15000;
        if(function_exists('kurs_usd') && function_exists('pembulatan_kurs')){
            $kurs = pembulatan_kurs(kurs_usd());
        }

        return DB::table('m_product_price as a')
            ->join('m_product as b', 'a.id_product', '=', 'b.id_product')
            ->join('m_product_brand as c', 'b.id_product_brand', '=', 'c.id_product_brand')
            ->where('a.id_product', $id)
            ->select(
                'a.id_product',
                'b.code_product',
                'b.nm_product',
                'a.product_price',
                'a.delivery_term',
                'a.flag_active',
                'a.product_price_agent',
                'c.nm_product_brand',
                'b.product_deskripsi'
            )
            ->selectRaw('? AS kurs_bank', [$kurs])
            ->first();
    }

    public function findDetail($id)
    {
        return ProductPrice::find($id);
    }

    public function create(array $data)
    {
        return ProductPrice::create($data);
    }

    public function update($id, array $data)
    {
        $price = ProductPrice::find($id);
        if ($price) {
            $price->update($data);
            return $price;
        }
        return null;
    }

    public function updateOption($id_opt, $amount)
    {
        $opt = ProductPriceOpt::find($id_opt);
        if($opt) {
            $opt->update(['amount' => $amount]);
        }
    }

    public function delete($id)
    {
        $price = ProductPrice::find($id);
        if ($price) {
            $price->update(['flag_active' => 0]); // Ganti status
        }
    }

    public function getHistory($id)
    {
        return ProductPriceHistory::where('id_product', $id)
            ->join('m_users', 'm_product_price_history.username', '=', 'm_users.username')
            ->select('m_product_price_history.product_price', 'm_product_price_history.waktu', 'm_users.nm_users')
            ->orderBy('m_product_price_history.waktu', 'desc')
            ->orderBy('m_product_price_history.status', 'desc')
            ->get();
    }

    public function getLatestHistoryPrice($id)
    {
        return ProductPriceHistory::where('id_product', $id)
            ->where('status', '1.Asal')
            ->orderBy('waktu', 'desc')
            ->first();
    }

    public function getOptions($id)
    {
        return ProductPriceOpt::where('id_product', $id)->where('f_cancel', '0')->get();
    }

    public function checkProduct($code)
    {
        return Product::where('code_product', $code)->first();
    }
}
