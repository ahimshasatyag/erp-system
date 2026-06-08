<?php

namespace App\Providers\productsubcategory;

use Illuminate\Support\ServiceProvider;
use App\Repositories\productsubcategory\ProductSubCategoryRepositoryInterface;
use App\Repositories\productsubcategory\ProductSubCategoryRepository;

class ProductSubCategoryServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            ProductSubCategoryRepositoryInterface::class,
            ProductSubCategoryRepository::class
        );
    }

    public function boot()
    {
        //
    }
}
