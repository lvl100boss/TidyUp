<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    // ...existing code...

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        // ...existing code...

        $this->routes(function () {
            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            Route::middleware('web')
                ->group(base_path('routes/shop.php'));

            Route::middleware('web')
                ->group(base_path('routes/auth.php'));

            Route::middleware('web')
                ->group(base_path('routes/booking.php'));

            Route::middleware('web')
                ->group(base_path('routes/shopappointments.php'));

            Route::middleware('web')
                ->group(base_path('routes/admin.php'));

            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));
        });

        // Define middleware aliases for Laravel 11
        if ($this->app->runningInConsole()) {
            $this->app->booted(function () {
                // Add admin middleware alias
                $this->app['router']->aliasMiddleware('admin', \App\Http\Middleware\AdminMiddleware::class);
                // Add shop creation access middleware alias
                $this->app['router']->aliasMiddleware('shop.creation', \App\Http\Middleware\EnsureShopCreationAccess::class);
            });
        } else {
            // Add admin middleware alias
            $this->app['router']->aliasMiddleware('admin', \App\Http\Middleware\AdminMiddleware::class);
            // Add shop creation access middleware alias
            $this->app['router']->aliasMiddleware('shop.creation', \App\Http\Middleware\EnsureShopCreationAccess::class);
        }
    }
}
