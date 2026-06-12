<?php

namespace App\Repositories\quotationsap;

use App\Models\quotationsap\QuotationAp;
use App\Models\quotationsap\QuotationApDetail;
use App\Models\quotationsap\QuotationApOptionDetail;
use App\Enums\quotationsap\QuotationApStatus;
use Illuminate\Support\Facades\DB;

class QuotationApRepository implements QuotationApRepositoryInterface
{
    public function getDatatable($request)
    {
        $query = QuotationAp::whereIn('status_po', [
            QuotationApStatus::QUOTATION->value, 
            QuotationApStatus::DRAFT->value, 
            QuotationApStatus::CANCEL->value
        ]);

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('code_po', 'like', "%{$search}%")
                  ->orWhere('status_po', 'like', "%{$search}%");
            });
        }

        $length = $request->input('length', 10);
        return $query->orderBy('id_po', 'desc')->paginate($length);
    }

    public function findById($id)
    {
        return QuotationAp::with(['details.options', 'details.product.unit'])->findOrFail($id);
    }

    public function createHeader(array $data)
    {
        return QuotationAp::create($data);
    }

    public function updateHeader($id, array $data)
    {
        $header = QuotationAp::findOrFail($id);
        $header->update($data);
        return $header;
    }

    public function deleteDetails($id_po)
    {
        QuotationApDetail::where('id_po', $id_po)->delete();
    }

    public function createDetail(array $data)
    {
        return QuotationApDetail::create($data);
    }

    public function updateDetail($id_po_dtl, array $data)
    {
        $detail = QuotationApDetail::findOrFail($id_po_dtl);
        $detail->update($data);
        return $detail;
    }

    public function incrementDetailQty($id_po_dtl, $qty)
    {
        QuotationApDetail::where('id_po_dtl', $id_po_dtl)->increment('qty', $qty);
    }

    public function checkDetailExists($id_po, $id_product)
    {
        return QuotationApDetail::where('id_po', $id_po)
            ->where('id_product', $id_product)
            ->first();
    }

    public function deleteOptionDetails($id_po_dtl)
    {
        QuotationApOptionDetail::where('id_po_dtl', $id_po_dtl)->delete();
    }

    public function createOptionDetail(array $data)
    {
        return QuotationApOptionDetail::create($data);
    }

    public function updateOptionDetail($id_po_opt_dtl, array $data)
    {
        $option = QuotationApOptionDetail::findOrFail($id_po_opt_dtl);
        $option->update($data);
        return $option;
    }

    public function updateAmountTotal($id_po, $amount)
    {
        QuotationAp::where('id_po', $id_po)->update(['amount_total' => $amount]);
    }

    public function updateStatus($id_po, $status)
    {
        QuotationAp::where('id_po', $id_po)->update(['status_po' => $status]);
    }

    public function updateCodePo($id_po, $new_code, $old_code)
    {
        QuotationAp::where('id_po', $id_po)->update([
            'code_po' => $new_code,
            'code_quotation' => $old_code
        ]);
    }

    public function createIncomingHeader(array $data)
    {
        return DB::table('tb_incoming_hdr')->insertGetId($data);
    }

    public function createIncomingDetail(array $data)
    {
        DB::table('tb_incoming_dtl')->insert($data);
    }
}
