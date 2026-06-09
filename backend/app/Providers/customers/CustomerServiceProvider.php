<?php

namespace App\Providers\customers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\customers\CustomerRepositoryInterface;
use App\Repositories\customers\CustomerRepository;

class CustomerServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            CustomerRepositoryInterface::class,
            CustomerRepository::class
        );
    }

    public function boot()
    {
        //
    }
}
