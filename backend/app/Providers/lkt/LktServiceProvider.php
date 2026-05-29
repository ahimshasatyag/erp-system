<?php

namespace App\Providers\lkt;

use Illuminate\Support\ServiceProvider;
use App\Models\lkt\Mmaster;
use App\Policies\lkt\LktPolicy;
use Illuminate\Support\Facades\Gate;

class LktServiceProvider extends ServiceProvider
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
        Gate::policy(Mmaster::class, LktPolicy::class);
    }
}
