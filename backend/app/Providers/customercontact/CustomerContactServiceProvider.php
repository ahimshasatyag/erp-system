<?php

namespace App\Providers\customercontact;

use Illuminate\Support\ServiceProvider;
use App\Repositories\customercontact\CustomerContactRepositoryInterface;
use App\Repositories\customercontact\CustomerContactRepository;

class CustomerContactServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register()
    {
        $this->app->bind(
            CustomerContactRepositoryInterface::class,
            CustomerContactRepository::class
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot()
    {
        //
    }
}
