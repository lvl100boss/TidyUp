<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\ServiceCategories;
use App\Models\ShopStaffs;
use App\Models\Shop;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopCatalogController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $shopStaff = ShopStaffs::where('staff_id', $user->id)->first();
        $shop = $shopStaff->shop;
        $shopServiceCategories = $shop->load('shopServiceCategories.serviceCategories')->shopServiceCategories;
        $serviceCategories = ServiceCategories::all();
        return Inertia::render('Shops/ShopCatalog', [
            'shopServiceCategories' => $shopServiceCategories,
            'serviceCategories' => $serviceCategories
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id'      => 'required|exists:service_categories,id',
            'service_name'     => 'required|string|max:255',
            'price'            => 'required|numeric|min:0',
            'duration_hour'    => 'required|integer|min:0|max:23',
            'duration_minute'  => 'required|integer|min:0|max:59',
        ]);


        DB::beginTransaction();
        try {
            $user = auth()->user();
            $shopStaff = ShopStaffs::where('staff_id', $user->id)->first();
            $shop = $shopStaff->shop;

            $service = $shop->shopServiceCategories()->create([
                'shop_id'             => $shop->id,
                'service_category_id' => $data['category_id'],
                'service_name'        => $data['service_name'],
                'cost'                => $data['price'],
                'duration_hour'       => $data['duration_hour'],
                'duration_minute'     => $data['duration_minute'],
            ]);

            DB::commit();

            // Return JSON response for XHR requests
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Service created successfully',
                    'service' => $service
                ]);
            }

            return redirect()->route('shop.catalog')
                ->with('message', 'Service created successfully')
                ->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();

            // Return JSON response for XHR requests
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service creation failed'
                ], 422);
            }

            return redirect()->route('shop.catalog')
                ->with('message', 'Service creation failed')
                ->with('success', false);
        }
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'service_name'     => 'required|string|max:255',
            'price'            => 'required|numeric|min:0',
            'duration_hour'    => 'required|integer|min:0|max:23',
            'duration_minute'  => 'required|integer|min:0|max:59',
        ]);
        DB::beginTransaction();
        try {
            $user = auth()->user();
            $shopStaff = ShopStaffs::where('staff_id', $user->id)->first();
            $shop = $shopStaff->shop;

            $service = $shop->shopServiceCategories()->findOrFail($id);
            $service->update([
                'service_name'    => $data['service_name'],
                'cost'           => $data['price'],
                'duration_hour'  => $data['duration_hour'],
                'duration_minute' => $data['duration_minute'],
            ]);

            DB::commit();

            // Return JSON response for XHR requests
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Service updated successfully',
                    'service' => $service->fresh()
                ]);
            }

            return redirect()->route('shop.catalog')
                ->with('message', 'Service updated successfully')
                ->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();

            // Return JSON response for XHR requests
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Service update failed'
                ], 422);
            }

            return redirect()->route('shop.catalog')
                ->with('message', 'Service update failed')
                ->with('success', false);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $user = auth()->user();
            $shopStaff = ShopStaffs::where('staff_id', $user->id)->first();
            $shop = $shopStaff->shop;

            $service = $shop->shopServiceCategories()->findOrFail($id);
            $service->delete();

            DB::commit();
            return redirect()->route('shop.catalog')->with('message', 'Service deleted successfully')->with('success', true);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('shop.catalog')->with('message', 'Service deletion failed')->with('success', false);
        }
    }
}
