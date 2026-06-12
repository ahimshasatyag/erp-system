<?php

namespace App\Actions\purchaserequisitions;

use Illuminate\Support\Facades\DB;
use App\Helpers\purchaserequisitions\PurchaseRequisitionHelper;

class GeneratePoFromPrAction
{
    public function execute(array $dataIdPrDtl)
    {
        $status = false;
        $codePo = null;
        $idPo = null;

        if (!empty($dataIdPrDtl)) {
            $periode = date("Ym");
            $codePo = PurchaseRequisitionHelper::generatePoCode('PO', $periode);
            $datePo = date("Y-m-d");
            $statusPo = "QUOTATION";
            $status = true;

            $idPo = DB::table('tb_po_hdr')->insertGetId([
                'code_po' => $codePo,
                'date_po' => $datePo,
                'status_po' => $statusPo,
            ]);

            foreach ($dataIdPrDtl as $row) {
                $idProduct = $row['id_product'];
                $idPrDtl = $row['id_pr_dtl'];
                $qtyPo = $row['qty_po'];

                // Get details from PR DTL
                $prDtl = DB::table('tb_pr_dtl')->where('id_pr_dtl', $idPrDtl)->first();

                if (!$prDtl) continue;

                $checkDataQty = DB::table('tb_po_dtl')
                    ->where('id_po', $idPo)
                    ->where('id_product', $idProduct)
                    ->first();

                if (!$checkDataQty) {
                    if ($qtyPo > 0) {
                        $idPoDtl = DB::table('tb_po_dtl')->insertGetId([
                            'id_po' => $idPo,
                            'id_product' => $idProduct,
                            'code_product' => $prDtl->code_product,
                            'nm_product' => $prDtl->nm_product,
                            'product_deskripsi' => $prDtl->product_deskripsi,
                            'qty' => $qtyPo
                        ]);

                        DB::table('tb_pr_dtl')
                            ->where('id_pr_dtl', $idPrDtl)
                            ->update([
                                'qty_po' => $qtyPo,
                                'id_po_dtl' => $idPoDtl
                            ]);
                    }
                } else {
                    if ($qtyPo > 0) {
                        $idPoDtl = $checkDataQty->id_po_dtl; // or equivalent depending on pk name, wait, codeigniter used check_data_qty->row()->id_po_dtl

                        // The PK is likely id_po_dtl based on codeigniter check check_data_qty->row()->id_po_dtl
                        DB::table('tb_po_dtl')
                            ->where('id_po_dtl', $idPoDtl)
                            ->where('id_product', $idProduct)
                            ->increment('qty', $qtyPo);

                        DB::table('tb_pr_dtl')
                            ->where('id_pr_dtl', $idPrDtl)
                            ->update([
                                'qty_po' => $qtyPo,
                                'id_po_dtl' => $idPoDtl
                            ]);
                    }
                }
            }
        }

        return [
            'status' => $status,
            'code_po' => $codePo,
            'id_po' => $idPo
        ];
    }
}
