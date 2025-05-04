<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

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
        Vite::prefetch(concurrency: 3);
        Route::middleware('api')
            ->prefix('api') // API routes will have "/api" prefix
            ->group(base_path('routes/api.php'));

        Schema::defaultStringLength(191);

        // Register model relationships 
        Relation::morphMap([
            'appointments' => 'App\Models\Appointments',
            'shop_staffs' => 'App\Models\ShopStaffs',
            'user' => 'App\Models\User',
        ]);
    }
}
