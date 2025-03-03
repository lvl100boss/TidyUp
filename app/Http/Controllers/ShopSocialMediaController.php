<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\ShopSocialMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ShopSocialMediaController extends Controller
{
    /**
     * Store a new social media entry
     */
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'url' => 'required|url|max:255',
                'icon' => 'required|string|in:Instagram,Facebook,Twitter,Youtube,Globe',
            ]);

            if ($validator->fails()) {
                return redirect()->back()->with('message', $validator->errors()->first())->with('success', false);
            }

            $user_id = Auth::user()->id;
            $shop = Shop::where('user_id', $user_id)->first();

            if (!$shop) {
                return redirect()->back()->with('message', 'Shop not found')->with('success', false);
            }

            // Create new social media entry
            ShopSocialMedia::create([
                'shop_id' => $shop->id,
                'name' => $request->name,
                'url' => $request->url,
                'icon' => $request->icon,
                'is_active' => true,
            ]);

            return redirect()->back()->with('message', 'Social media added successfully')->with('success', true);
        } catch (\Exception $e) {
            Log::error('Error adding social media: ' . $e->getMessage());
            return redirect()->back()->with('message', 'Failed to add social media: ' . $e->getMessage())->with('success', false);
        }
    }

    /**
     * Update an existing social media entry
     */
    public function update(Request $request, $id)
    {
        try {
            // Validate the request
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'url' => 'required|url|max:255',
                'icon' => 'required|string|in:Instagram,Facebook,Twitter,Youtube,Globe',
            ]);

            if ($validator->fails()) {
                return redirect()->back()->with('message', $validator->errors()->first())->with('success', false);
            }

            $user_id = Auth::user()->id;
            $shop = Shop::where('user_id', $user_id)->first();

            if (!$shop) {
                return redirect()->back()->with('message', 'Shop not found')->with('success', false);
            }

            // Get social media entry
            $socialMedia = ShopSocialMedia::where('id', $id)
                ->where('shop_id', $shop->id)
                ->first();

            if (!$socialMedia) {
                return redirect()->back()->with('message', 'Social media not found')->with('success', false);
            }

            // Update social media entry
            $socialMedia->name = $request->name;
            $socialMedia->url = $request->url;
            $socialMedia->icon = $request->icon;
            $socialMedia->save();

            return redirect()->back()->with('message', 'Social media updated successfully')->with('success', true);
        } catch (\Exception $e) {
            Log::error('Error updating social media: ' . $e->getMessage());
            return redirect()->back()->with('message', 'Failed to update social media: ' . $e->getMessage())->with('success', false);
        }
    }

    /**
     * Delete a social media entry
     */
    public function destroy($id)
    {
        try {
            $user_id = Auth::user()->id;
            $shop = Shop::where('user_id', $user_id)->first();

            if (!$shop) {
                return redirect()->back()->with('message', 'Shop not found')->with('success', false);
            }

            // Get social media entry
            $socialMedia = ShopSocialMedia::where('id', $id)
                ->where('shop_id', $shop->id)
                ->first();

            if (!$socialMedia) {
                return redirect()->back()->with('message', 'Social media not found')->with('success', false);
            }

            // Delete social media entry
            $socialMedia->delete();

            return redirect()->back()->with('message', 'Social media deleted successfully')->with('success', true);
        } catch (\Exception $e) {
            Log::error('Error deleting social media: ' . $e->getMessage());
            return redirect()->back()->with('message', 'Failed to delete social media: ' . $e->getMessage())->with('success', false);
        }
    }
}
