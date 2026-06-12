<?php

namespace App\Services\purchaserequisitions;

use App\Models\purchaserequisitions\PurchaseRequisition;
use App\Models\purchaserequisitions\PurchaseRequisitionDetail;
use App\Helpers\purchaserequisitions\PurchaseRequisitionHelper;
use Illuminate\Support\Facades\DB;
use Exception;

class PurchaseRequisitionService
{
    public function create(array $data)
    {
        DB::beginTransaction();

        try {
            $dateRequest = date("Y-m-d", strtotime($data['date_request']));
            $periode = date("Ym", strtotime($dateRequest));
            $dateDeadline = date("Y-m-d", strtotime($data['date_deadline']));
            
            $codePr = PurchaseRequisitionHelper::generateCode('PR', $periode);

            $pr = PurchaseRequisition::create([
                'code_pr' => $codePr,
                'username' => $data['username'],
                'date_request' => $dateRequest,
                'date_deadline' => $dateDeadline,
                'status_pr' => 'DRAFT'
            ]);

            if (isset($data['details']) && is_array($data['details'])) {
                foreach ($data['details'] as $detail) {
                    $product = \App\Models\products\Product::find($detail['id_product']);
                    
                    if ($product) {
                        PurchaseRequisitionDetail::create([
                            'id_pr' => $pr->id_pr,
                            'id_product' => $detail['id_product'],
                            'code_product' => $product->code_product,
                            'nm_product' => $product->nm_product,
                            'product_deskripsi' => $product->product_deskripsi ?? '',
                            'qty' => $detail['qty'],
                            'note' => $detail['note'] ?? '',
                            'qty_po' => 0
                        ]);
                    }
                }
            }

            DB::commit();
            return $pr;

        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function update($id, array $data)
    {
        DB::beginTransaction();

        try {
            $pr = PurchaseRequisition::findOrFail($id);

            $dateRequest = date("Y-m-d", strtotime($data['date_request']));
            $dateDeadline = date("Y-m-d", strtotime($data['date_deadline']));

            $pr->update([
                'username' => $data['username'],
                'date_request' => $dateRequest,
                'date_deadline' => $dateDeadline,
            ]);

            // Delete existing details and recreate
            PurchaseRequisitionDetail::where('id_pr', $id)->delete();

            if (isset($data['details']) && is_array($data['details'])) {
                foreach ($data['details'] as $detail) {
                    $product = \App\Models\products\Product::find($detail['id_product']);
                    
                    if ($product) {
                        PurchaseRequisitionDetail::create([
                            'id_pr' => $pr->id_pr,
                            'id_product' => $detail['id_product'],
                            'code_product' => $product->code_product,
                            'nm_product' => $product->nm_product,
                            'product_deskripsi' => $product->product_deskripsi ?? '',
                            'qty' => $detail['qty'],
                            'note' => $detail['note'] ?? '',
                            'qty_po' => 0
                        ]);
                    }
                }
            }

            DB::commit();
            return $pr;

        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
