<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\OperationHours;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ShopProfileController extends Controller
{
    public function index()
    {
        $user_id = auth()->user()->id;
        $shop = Shop::with(['shopGallery', 'shopOperationHours', 'shopServiceCategories.serviceCategories', 'staffs.staff'])->where('user_id', $user_id)->first();

        return Inertia::render('Shops/ShopProfile', [
            'shop' => $shop,
        ]);
    }

    public function updateOperationHours(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'operation_hours' => 'required|array',
                'operation_hours.*.id' => 'required|integer|exists:shop_operation_hours,id',
                'operation_hours.*.shop_id' => 'required|integer',
                'operation_hours.*.day' => 'required|string',
                'operation_hours.*.is_open' => 'required|integer|in:0,1',
                'operation_hours.*.open_time' => 'nullable|string',
                'operation_hours.*.close_time' => 'nullable|string',
            ]);

            $user_id = auth()->user()->id;
            $shop = Shop::where('user_id', $user_id)->first();

            if (!$shop) {
                return redirect()->back()->with('message', 'Shop not found')->with('success', false);
            }

            // Get shop ID
            $shopId = $shop->id;

            // Process each operation hour
            foreach ($request->operation_hours as $hourData) {
                // Make sure the user is only updating their own shop's hours
                if ($hourData['shop_id'] != $shopId) {
                    continue;
                }

                $operationHour = OperationHours::where('id', $hourData['id'])
                    ->where('shop_id', $shopId)
                    ->first();

                if (!$operationHour) {
                    continue;
                }

                // Update the operation hour
                $operationHour->is_open = $hourData['is_open'];

                if ($hourData['is_open']) {
                    $operationHour->open_time = $hourData['open_time'];
                    $operationHour->close_time = $hourData['close_time'];
                }

                $operationHour->save();
            }

            return redirect()->back()->with('message', 'Operation hours updated successfully')->with('success', true);
        } catch (\Exception $e) {
            Log::error('Error updating operation hours: ' . $e->getMessage());
            return redirect()->back()->with('message', 'Failed to update operation hours: ' . $e->getMessage())->with('success', false);
        }
    }

    public function updateContactInfo(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'email' => 'required|email|max:255',
                'contact_number' => 'required|string|max:20',
                'detailed_address' => 'required|string|max:255',
            ]);

            $user_id = auth()->user()->id;
            $shop = Shop::where('user_id', $user_id)->first();

            if (!$shop) {
                return redirect()->back()->with('message', 'Shop not found')->with('success', false);
            }

            // Update shop contact information
            $shop->email = $validated['email'];
            $shop->contact_number = $validated['contact_number'];
            $shop->detailed_address = $validated['detailed_address'];
            $shop->save();

            return redirect()->back()->with('message', 'Contact information updated successfully')->with('success', true);
        } catch (\Exception $e) {
            Log::error('Error updating contact information: ' . $e->getMessage());
            return redirect()->back()->with('message', 'Failed to update contact information: ' . $e->getMessage())->with('success', false);
        }
    }
}
