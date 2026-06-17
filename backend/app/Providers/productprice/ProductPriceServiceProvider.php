<?php

namespace App\Providers\productprice;

use Illuminate\Support\ServiceProvider;
use App\Repositories\productprice\ProductPriceRepositoryInterface;
use App\Repositories\productprice\ProductPriceRepository;

class ProductPriceServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(ProductPriceRepositoryInterface::class, ProductPriceRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
