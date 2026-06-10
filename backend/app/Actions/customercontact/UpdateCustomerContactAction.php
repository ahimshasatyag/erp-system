<?php

namespace App\Actions\customercontact;

use App\Repositories\customercontact\CustomerContactRepositoryInterface;

class UpdateCustomerContactAction
{
    protected $repository;

    public function __construct(CustomerContactRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function execute($id, array $data)
    {
        return $this->repository->update($id, $data);
    }
}
