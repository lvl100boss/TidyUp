<?php

namespace App\Http\Controllers;

use App\Models\ShopGallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;

class ShopGalleryController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:25048', // 2MB max size
            ]
        ]);

        $shop = auth()->user()->shop;

        $uploadedImages = [];

        foreach ($request->file('images') as $image) {
            $path = $image->store('shop-gallery', 'public');

            $shopGallery = $shop->shopGallery()->create([
                'url' => 'storage/' . $path,
            ]);

            $uploadedImages[] = $shopGallery;
        }

        return back()->with('success', 'Images uploaded successfully');
    }

    public function delete(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'exists:shop_gallery,id'
        ]);

        $shop = auth()->user()->shop;

        $images = $shop->shopGallery()
            ->whereIn('id', $request->images)
            ->get();

        foreach ($images as $image) {
            // Remove 'storage/' prefix from url before deleting
            $path = str_replace('storage/', '', $image->url);
            // Delete the physical file
            Storage::disk('public')->delete($path);
            // Delete the database record
            $image->delete();
        }

        return back()->with('success', 'Images deleted successfully');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'exists:shop_galleries,id'
        ]);

        $shop = auth()->user()->shop;

        foreach ($request->images as $index => $id) {
            $shop->gallery()
                ->where('id', $id)
                ->update(['order' => $index]);
        }

        return back()->with('success', 'Gallery reordered successfully');
    }
}
