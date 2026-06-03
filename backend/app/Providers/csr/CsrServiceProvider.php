<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\csr\Mmaster;
use App\Policies\CsrPolicy;
use Illuminate\Support\Facades\Gate;

class CsrServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // You can bind interfaces to repositories here if implementing interface patterns
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Gate::policy(Mmaster::class, CsrPolicy::class);
    }
}
