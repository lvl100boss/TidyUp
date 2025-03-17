<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\ServiceCategories;
use App\Models\ShopStaffs;
use App\Models\Shop;
use App\Models\ShopServiceCategories;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class ShopCatalogController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $shopStaff = ShopStaffs::where('staff_id', $user->id)->first();
        $shop = $shopStaff->shop;
        $shopServices = $shop->load('shopServiceCategories.serviceCategories')->shopServiceCategories;
        $serviceCategories = ServiceCategories::all();
        return Inertia::render('Shops/ShopCatalog', [
            'shopServices' => $shopServices,
            'serviceCategories' => $serviceCategories
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'service_name' => 'required|string|max:255',
            'service_category_id' => 'required|exists:service_categories,id',
            'cost' => 'required|numeric|min:0',
            'duration_hour' => 'required|integer|min:0|max:23',
            'duration_minute' => 'required|integer|min:0|max:59',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', $validator->errors()->first())->with('success', false);
        }

        $user = auth()->user();
        $shopStaff = ShopStaffs::where('staff_id', $user->id)->first();
        $shop = $shopStaff->shop;

        ShopServiceCategories::create([
            'shop_id' => $shop->id,
            'service_category_id' => $request->service_category_id,
            'service_name' => $request->service_name,
            'cost' => $request->cost,
            'duration_hour' => $request->duration_hour,
            'duration_minute' => $request->duration_minute,
        ]);

        return redirect()->route('shop.catalog')->with('message', 'Service created successfully')->with('success', true);
    }

    public function update(Request $request, $id)
    {
        // Log incoming request for debugging
        \Log::info('Update request data:', ['request' => $request->all(), 'id' => $id]);

        $validator = Validator::make($request->all(), [
            'service_name' => 'required|string|max:255',
            'service_category_id' => 'required|exists:service_categories,id',
            'cost' => 'required|numeric|min:0',
            'duration_hour' => 'required|integer|min:0|max:23',
            'duration_minute' => 'required|integer|min:0|max:59',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->with('message', $validator->errors()->first())->with('success', false);
        }

        $user = auth()->user();
        $shopStaff = ShopStaffs::where('staff_id', $user->id)->first();
        $shop = $shopStaff->shop;

        $shopService = ShopServiceCategories::where('id', $id)
            ->where('shop_id', $shop->id)
            ->first();

        if (!$shopService) {
            return redirect()->back()->with('message', 'Service not found')->with('success', false);
        }

        try {
            $shopService->update([
                'service_category_id' => $request->service_category_id,
                'service_name' => $request->service_name,
                'cost' => $request->cost,
                'duration_hour' => $request->duration_hour,
                'duration_minute' => $request->duration_minute,
            ]);

            return redirect()->route('shop.catalog')->with('message', 'Service updated successfully')->with('success', true);
        } catch (\Exception $e) {
            \Log::error('Error updating service:', ['error' => $e->getMessage()]);
            return redirect()->back()->with('message', 'Error updating service: ' . $e->getMessage())->with('success', false);
        }
    }

    public function destroy($id)
    {
        // Log incoming request for debugging
        \Log::info('Delete request for service id:', ['id' => $id]);

        $user = auth()->user();
        $shopStaff = ShopStaffs::where('staff_id', $user->id)->first();
        $shop = $shopStaff->shop;

        $shopService = ShopServiceCategories::where('id', $id)
            ->where('shop_id', $shop->id)
            ->first();

        if (!$shopService) {
            return redirect()->back()->with('message', 'Service not found')->with('success', false);
        }

        try {
            $shopService->delete();
            return redirect()->route('shop.catalog')->with('message', 'Service deleted successfully')->with('success', true);
        } catch (\Exception $e) {
            \Log::error('Error deleting service:', ['error' => $e->getMessage()]);
            return redirect()->back()->with('message', 'Error deleting service: ' . $e->getMessage())->with('success', false);
        }
    }
}
