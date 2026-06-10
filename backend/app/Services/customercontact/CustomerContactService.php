<?php

namespace App\Services\customercontact;

use App\Actions\customercontact\CreateCustomerContactAction;
use App\Actions\customercontact\UpdateCustomerContactAction;
use App\Actions\customercontact\DeleteCustomerContactAction;
use App\Repositories\customercontact\CustomerContactRepositoryInterface;

class CustomerContactService
{
    protected $repository;
    protected $createAction;
    protected $updateAction;
    protected $deleteAction;

    public function __construct(
        CustomerContactRepositoryInterface $repository,
        CreateCustomerContactAction $createAction,
        UpdateCustomerContactAction $updateAction,
        DeleteCustomerContactAction $deleteAction
    ) {
        $this->repository = $repository;
        $this->createAction = $createAction;
        $this->updateAction = $updateAction;
        $this->deleteAction = $deleteAction;
    }

    public function getDatatable($request)
    {
        return $this->repository->getDatatable($request);
    }

    public function createCustomerContact(array $data)
    {
        return $this->createAction->execute($data);
    }

    public function updateCustomerContact($id, array $data)
    {
        return $this->updateAction->execute($id, $data);
    }

    public function deleteCustomerContact($id)
    {
        return $this->deleteAction->execute($id);
    }

    public function getCustomerContact($id)
    {
        return $this->repository->findById($id);
    }

    public function getCustomers()
    {
        return $this->repository->getCustomers();
    }
}
