<?php

namespace App\Providers\cst;

use Illuminate\Support\ServiceProvider;
use App\Models\cst\Mmaster;
use App\Policies\cst\CstPolicy;
use Illuminate\Support\Facades\Gate;

class CstServiceProvider extends ServiceProvider
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
        Gate::policy(Mmaster::class, CstPolicy::class);
    }
}
