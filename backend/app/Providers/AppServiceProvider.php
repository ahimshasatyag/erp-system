<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Menu;
use App\Policies\MenuPolicy;
use App\Models\customercontact\CustomerContact;
use App\Policies\customercontact\CustomerContactPolicy;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Menu::class, MenuPolicy::class);
        Gate::policy(CustomerContact::class, CustomerContactPolicy::class);
    }
}
