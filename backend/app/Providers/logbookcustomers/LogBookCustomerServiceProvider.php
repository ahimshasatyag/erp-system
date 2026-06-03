<?php

namespace App\Providers\logbookcustomers;

use Illuminate\Support\ServiceProvider;
use App\Models\logbookcustomers\LogBookCustomer;
use App\Policies\logbookcustomers\LogBookCustomerPolicy;
use Illuminate\Support\Facades\Gate;

class LogBookCustomerServiceProvider extends ServiceProvider
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
        Gate::policy(LogBookCustomer::class, LogBookCustomerPolicy::class);
    }
}
