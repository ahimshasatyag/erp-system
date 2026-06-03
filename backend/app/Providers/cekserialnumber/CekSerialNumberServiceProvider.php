<?php

namespace App\Providers\cekserialnumber;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\cekserialnumber\Mmaster;
use App\Policies\cekserialnumber\CekSerialNumberPolicy;

class CekSerialNumberServiceProvider extends ServiceProvider
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
        Gate::policy(Mmaster::class, CekSerialNumberPolicy::class);
    }
}
