<?php

namespace App\Providers\logbookproduct;

use Illuminate\Support\ServiceProvider;
use App\Models\logbookproduct\LogBookProduct;
use App\Policies\logbookproduct\LogBookProductPolicy;
use Illuminate\Support\Facades\Gate;

class LogBookProductServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::policy(LogBookProduct::class, LogBookProductPolicy::class);
    }
}
