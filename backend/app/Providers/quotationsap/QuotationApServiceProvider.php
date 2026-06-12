<?php

namespace App\Providers\quotationsap;

use Illuminate\Support\ServiceProvider;
use App\Repositories\quotationsap\QuotationApRepositoryInterface;
use App\Repositories\quotationsap\QuotationApRepository;

class QuotationApServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            QuotationApRepositoryInterface::class,
            QuotationApRepository::class
        );
    }

    public function boot()
    {
        //
    }
}
