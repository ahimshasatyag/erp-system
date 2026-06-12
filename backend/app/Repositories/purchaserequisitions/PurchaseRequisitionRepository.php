<?php

namespace App\Repositories\purchaserequisitions;

use App\Models\purchaserequisitions\PurchaseRequisition;
use Illuminate\Support\Facades\DB;

class PurchaseRequisitionRepository implements PurchaseRequisitionRepositoryInterface
{
    public function getDatatable($request)
    {
        $query = PurchaseRequisition::query();

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code_pr', 'ILIKE', "%{$search}%")
                  ->orWhere('username', 'ILIKE', "%{$search}%")
                  ->orWhere('status_pr', 'ILIKE', "%{$search}%");
            });
        }

        $sortBy = $request->get('sort_by', 'id_pr');
        $sortDir = $request->get('sort_dir', 'desc');
        
        $query->orderBy($sortBy, $sortDir);

        $perPage = $request->get('per_page', 10);
        return $query->paginate($perPage);
    }

    public function getPrDatatable($request)
    {
        // Replicates data_pr() from Mmaster
        // select a.id_pr_dtl, a.id_pr, a.id_product, c.nm_product, c.code_product, d.nm_users, b.code_pr, a.qty  from tb_pr_dtl a, tb_pr_hdr b, m_product c, m_users d
        // where a.id_pr = b.id_pr
        // and a.id_product = c.id_product
        // and b.status_pr = 'PR'
        // and a.qty_po = 0
        // and b.username = d.username 

        $query = DB::table('tb_pr_dtl as a')
            ->join('tb_pr_hdr as b', 'a.id_pr', '=', 'b.id_pr')
            ->join('m_product as c', 'a.id_product', '=', 'c.id_product')
            ->join('m_users as d', 'b.username', '=', 'd.username')
            ->where('b.status_pr', 'PR')
            ->where('a.qty_po', 0)
            ->select(
                'a.id_pr_dtl', 
                'a.id_pr', 
                'a.id_product', 
                'c.nm_product', 
                'c.code_product', 
                'd.nm_users', 
                'b.code_pr', 
                'a.qty'
            );

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('b.code_pr', 'ILIKE', "%{$search}%")
                  ->orWhere('c.nm_product', 'ILIKE', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 10);
        return $query->paginate($perPage);
    }

    public function findById($id)
    {
        return PurchaseRequisition::with('details')->find($id);
    }

    public function getProducts()
    {
        return DB::table('m_product')->get();
    }

    public function getGudangs()
    {
        return DB::table('m_gudang')->get();
    }

    public function getUsers()
    {
        return DB::table('m_users')->get();
    }

    public function getProductDetail($idProduct)
    {
        $product = \App\Models\products\Product::with('unit')->find($idProduct);
        if ($product) {
            return (object) [
                'id_product' => $product->id_product,
                'code_product' => $product->code_product,
                'nm_product' => $product->nm_product,
                'nm_product_satuan' => $product->unit ? $product->unit->nm_product_satuan : null,
            ];
        }
        return null;
    }

    public function checkQtyDtl($idPo, $idProduct)
    {
        return DB::table('tb_po_dtl')
            ->where('id_po', $idPo)
            ->where('id_product', $idProduct)
            ->first();
    }
}
