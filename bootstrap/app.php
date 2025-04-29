<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\CheckUserRestriction::class, // Add this line
        ]);

        $middleware->alias([
            'check.restriction' => \App\Http\Middleware\CheckUserRestriction::class,
            'shop.creation' => \App\Http\Middleware\EnsureShopCreationAccess::class,
            'shop.owner.staff' => \App\Http\Middleware\CheckShopAccess::class,
            'shop.owner.manager' => \App\Http\Middleware\CheckShopOwnerOrManager::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
