<?php

namespace App\Repositories\productpricemkt;

use Illuminate\Support\Facades\DB;
use App\Models\productpricemkt\ProductPriceSearchHistory;

class ProductPriceMktRepository
{
    /**
     * Get list of active product prices.
     */
    public function getProductList()
    {
        return DB::select("select a.id_product, b.code_product, b.nm_product, b.product_deskripsi
        FROM m_product_price a, m_product b
        where a.id_product = b.id_product
        and a.flag_active = '1'
        order by a.date_update desc");
    }

    /**
     * Get basic product detail.
     */
    public function getDetailBarang1($id_product)
    {
        $result = DB::select("select a.id_product, b.code_product, b.nm_product, a.product_price, a.product_price_agent, a.date_update, b.link_brosur, b.product_deskripsi
        FROM m_product_price a, m_product b
        where a.id_product = b.id_product
        and a.flag_active = '1'
        and a.id_product = ?", [$id_product]);

        return count($result) > 0 ? $result[0] : null;
    }

    /**
     * Get product options.
     */
    public function getOptions($id_product)
    {
        return DB::select("select * from m_product_price_opt where id_product = ? and f_cancel = '0'", [$id_product]);
    }

    /**
     * Insert into search history.
     */
    public function insertHistory($id_product, $username)
    {
        return ProductPriceSearchHistory::create([
            'id_product' => $id_product,
            'username' => $username,
            'date_create' => now()
        ]);
    }

    /**
     * Fallback to find the latest history date if product_price.date_update is null.
     */
    public function getLatestHistoryWaktu($id_product)
    {
        $result = DB::select("select waktu from m_product_price_history where id_product = ?
            order by waktu desc
            limit 1", [$id_product]);

        return count($result) > 0 ? $result[0]->waktu : null;
    }

    /**
     * Complex query to get detail barang with estimation, primarily used for PDF.
     */
    public function getDetailBarang($id_product, $kurs)
    {
        $result = DB::select("select
        x.id_product,
        z.code_product,
        z.nm_product,
        z.link_brosur,
        x.product_price,
        y.waktu,
        ? as kurs_bank,
        (? * x.product_price) as estimasi
    from
        (
            select
                a.id_product,
                a.product_price,
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
                        AND status = '3.Baru'
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
                        AND status = '1.Asal'
                        )
        union ALL
            select
                a.id_product,
                a.product_price,
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
                        AND status = '1.Asal'
                )
        UNION ALL
            select
                a.id_product,
                a.product_price,
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
                                        AND status = '3.Baru'
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
                                        AND status = '1.Asal'
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
                and x.id_product = ?
    order by
        x.aksi desc", [$kurs, $kurs, $id_product]);

        return count($result) > 0 ? $result[0] : null;
    }
}
