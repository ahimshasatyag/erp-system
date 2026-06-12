<?php

namespace App\Repositories\purchaserequisitions;

interface PurchaseRequisitionRepositoryInterface
{
    public function getDatatable($request);
    public function getPrDatatable($request);
    public function findById($id);
    public function getProducts();
    public function getGudangs();
    public function getUsers();
    public function getProductDetail($idProduct);
    public function checkQtyDtl($idPo, $idProduct);
}
