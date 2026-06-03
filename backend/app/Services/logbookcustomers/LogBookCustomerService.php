<?php

namespace App\Services\logbookcustomers;

use App\Repositories\logbookcustomers\LogBookCustomerRepository;
use App\Actions\logbookcustomers\CreateLogBookCustomerAction;
use App\Actions\logbookcustomers\UpdateLogBookCustomerAction;
use App\Actions\logbookcustomers\DeleteLogBookCustomerAction;

class LogBookCustomerService
{
    public function __construct(
        protected LogBookCustomerRepository $repository,
        protected CreateLogBookCustomerAction $createAction,
        protected UpdateLogBookCustomerAction $updateAction,
        protected DeleteLogBookCustomerAction $deleteAction
    ) {}

    public function getAll(string $search = null, string $startDate = null, string $endDate = null, bool $all = false)
    {
        return $this->repository->getAll($search, $startDate, $endDate, $all);
    }

    public function getDetail(string $idLogBook)
    {
        return $this->repository->getById($idLogBook);
    }

    public function createLogBook(array $data, string $username)
    {
        return $this->createAction->execute($data, $username);
    }

    public function updateLogBook(string $idLogBook, array $data)
    {
        return $this->updateAction->execute($idLogBook, $data);
    }

    public function deleteLogBook(string $idLogBook)
    {
        return $this->deleteAction->execute($idLogBook);
    }

    public function getCustomersList()
    {
        return $this->repository->getCustomers();
    }
}
