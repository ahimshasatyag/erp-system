<?php

namespace App\Providers\productpricemkt;

use Illuminate\Support\ServiceProvider;
use App\Services\productpricemkt\ProductPriceMktService;
use App\Repositories\productpricemkt\ProductPriceMktRepository;

class ProductPriceMktServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(ProductPriceMktService::class, function ($app) {
            return new ProductPriceMktService($app->make(ProductPriceMktRepository::class));
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Add boot logic if necessary
    }
}
