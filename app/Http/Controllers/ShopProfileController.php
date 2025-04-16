<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\OperationHours;
use App\Models\ShopStaffs;
use App\Models\User;
use App\Models\ShopCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ShopProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $shopStaff = ShopStaffs::where('staff_id', $user->id)->first();
        $shop = $shopStaff->shop;
        $shop = $shop->load([
            'shopGallery',
            'shopOperationHours',
            'shopServiceCategories.serviceCategories',
            'staffs.staff',
            'socialMedia',
            'shopCategories.categories',
        ]);
        // dd($shop);

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

    public function updateShopProfile(Request $request)
    {
        try {
            // Log the entire request for debugging
            Log::info('Shop Profile Update Request', [
                'data' => $request->all(),
                'files' => $request->hasFile('shop_photo') ? 'Has photo' : 'No photo',
            ]);

            // Validate the request
            $validated = $request->validate([
                'shop_name' => 'required|string|max:255',
                'bio' => 'nullable|string|max:500',
                'shop_photo' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:24048',
                'shop_categories' => 'required|array',
                'shop_categories.*' => 'exists:categories,id',
            ]);

            $user = Auth::user();
            $shop = Shop::where('user_id', $user->id)->first();

            if (!$shop) {
                return redirect()->back()->with('message', 'Shop not found')->with('success', false);
            }

            // Update shop name and bio
            $shop->shop_name = $validated['shop_name'];
            $shop->bio = $validated['bio'] ?? $shop->bio;

            // Handle photo upload if provided
            if ($request->hasFile('shop_photo')) {
                try {
                    // Delete old photo if it exists and is not a default image
                    if ($shop->shop_photo && !str_contains($shop->shop_photo, 'default') && Storage::disk('public')->exists($shop->shop_photo)) {
                        Storage::disk('public')->delete($shop->shop_photo);
                    }

                    // Store the new photo with proper path handling
                    $photoName = time() . '_' . $request->file('shop_photo')->getClientOriginalName();
                    $photoPath = 'storage/' . $request->file('shop_photo')->storeAs('shop_photos', $photoName, 'public');
                    $shop->shop_photo = $photoPath;

                    Log::info('Photo uploaded successfully', ['path' => $photoPath]);
                } catch (\Exception $e) {
                    Log::error('Error uploading photo: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
                    return redirect()->back()->with('message', 'Failed to upload photo: ' . $e->getMessage())->with('success', false);
                }
            }

            // Handle shop categories update
            try {
                // Get current shop categories
                $currentCategories = $shop->shopCategories()->pluck('category_id')->toArray();

                // Categories to add (new ones)
                $categoriesToAdd = array_diff($validated['shop_categories'], $currentCategories);

                // Categories to remove (ones that are no longer selected)
                $categoriesToRemove = array_diff($currentCategories, $validated['shop_categories']);

                // Add new categories
                foreach ($categoriesToAdd as $categoryId) {
                    ShopCategory::create([
                        'shop_id' => $shop->id,
                        'category_id' => $categoryId,
                    ]);
                }

                // Remove unselected categories
                if (!empty($categoriesToRemove)) {
                    ShopCategory::where('shop_id', $shop->id)
                        ->whereIn('category_id', $categoriesToRemove)
                        ->delete();
                }

                Log::info('Shop categories updated successfully', [
                    'added' => $categoriesToAdd,
                    'removed' => $categoriesToRemove
                ]);
            } catch (\Exception $e) {
                Log::error('Error updating shop categories: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
                return redirect()->back()->with('message', 'Failed to update shop categories: ' . $e->getMessage())->with('success', false);
            }

            $shop->save();

            Log::info('Shop updated successfully', ['shop' => $shop->toArray()]);

            return redirect()->back()->with('message', 'Shop profile updated successfully')->with('success', true);
        } catch (\Exception $e) {
            Log::error('Error updating shop profile: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return redirect()->back()->with('message', 'Failed to update shop profile: ' . $e->getMessage())->with('success', false);
        }
    }
}
