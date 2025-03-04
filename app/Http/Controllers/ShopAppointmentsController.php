<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopAppointmentsController extends Controller
{
    //
    public function index()
    {
        return Inertia::render('Shops/Appointments');
    }
}
