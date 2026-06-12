<?php

namespace App\Providers\purchaserequisitions;

use Illuminate\Support\ServiceProvider;
use App\Repositories\purchaserequisitions\PurchaseRequisitionRepositoryInterface;
use App\Repositories\purchaserequisitions\PurchaseRequisitionRepository;

class PurchaseRequisitionServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            PurchaseRequisitionRepositoryInterface::class,
            PurchaseRequisitionRepository::class
        );
    }

    public function boot()
    {
        //
    }
}
