<?php

namespace App\Providers\productunit;

use Illuminate\Support\ServiceProvider;
use App\Repositories\productunit\ProductUnitRepositoryInterface;
use App\Repositories\productunit\ProductUnitRepository;

class ProductUnitServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            ProductUnitRepositoryInterface::class,
            ProductUnitRepository::class
        );
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
