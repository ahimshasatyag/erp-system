<?php

namespace App\Repositories\customers;

interface CustomerRepositoryInterface
{
    public function getDatatable($request);
    public function findById(string $idCustomers);
    public function getProvinces();
    public function getKabupatenByProvinsi(string $provinsiId);
}
