<?php

namespace App\Providers\productbrand;

use Illuminate\Support\ServiceProvider;
use App\Repositories\productbrand\ProductBrandRepositoryInterface;
use App\Repositories\productbrand\ProductBrandRepository;

class ProductBrandServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            ProductBrandRepositoryInterface::class,
            ProductBrandRepository::class
        );
    }

    public function boot()
    {
        //
    }
}
