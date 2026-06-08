<?php

namespace App\Providers\productcategory;

use Illuminate\Support\ServiceProvider;
use App\Repositories\productcategory\ProductCategoryRepositoryInterface;
use App\Repositories\productcategory\ProductCategoryRepository;

class ProductCategoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            ProductCategoryRepositoryInterface::class,
            ProductCategoryRepository::class
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
