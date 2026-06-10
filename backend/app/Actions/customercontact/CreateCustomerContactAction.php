<?php

namespace App\Actions\customercontact;

use App\Repositories\customercontact\CustomerContactRepositoryInterface;

class CreateCustomerContactAction
{
    protected $repository;

    public function __construct(CustomerContactRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function execute(array $data)
    {
        return $this->repository->create($data);
    }
}
