<?php

namespace App\Providers\suppliers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\suppliers\SupplierRepositoryInterface;
use App\Repositories\suppliers\SupplierRepository;

class SupplierServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            SupplierRepositoryInterface::class,
            SupplierRepository::class
        );
    }

    public function boot()
    {
        //
    }
}
