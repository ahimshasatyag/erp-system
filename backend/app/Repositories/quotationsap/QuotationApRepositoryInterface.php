<?php

namespace App\Repositories\quotationsap;

interface QuotationApRepositoryInterface
{
    public function getDatatable($request);
    public function findById($id);
    public function createHeader(array $data);
    public function updateHeader($id, array $data);
    public function deleteDetails($id_po);
    public function createDetail(array $data);
    public function updateDetail($id_po_dtl, array $data);
    public function incrementDetailQty($id_po_dtl, $qty);
    public function checkDetailExists($id_po, $id_product);
    
    // Options
    public function deleteOptionDetails($id_po_dtl);
    public function createOptionDetail(array $data);
    public function updateOptionDetail($id_po_opt_dtl, array $data);
    
    // Utilities
    public function updateAmountTotal($id_po, $amount);
    public function updateStatus($id_po, $status);
    public function updateCodePo($id_po, $new_code, $old_code);
    
    // Incoming
    public function createIncomingHeader(array $data);
    public function createIncomingDetail(array $data);
}
