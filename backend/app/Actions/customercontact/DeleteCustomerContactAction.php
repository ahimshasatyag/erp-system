<?php

namespace App\Actions\customercontact;

use App\Repositories\customercontact\CustomerContactRepositoryInterface;

class DeleteCustomerContactAction
{
    protected $repository;

    public function __construct(CustomerContactRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function execute($id)
    {
        return $this->repository->delete($id);
    }
}
