<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;
use App\Models\OperationHours;
use App\Models\ShopLegalDocument;
use App\Models\ShopGallery;
use App\Models\ShopStaffs;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        // Get shop owner role ID from the roles table
        $shopOwnerRole = DB::table('roles')->where('role_name', 'Shop Owner')->first();
        
        if (!$shopOwnerRole) {
            throw new \Exception("Role 'Shop Owner' not found. Please run the roles migration first.");
        }
        
        // Create predefined shops with their respective details
        $shops = [
            [
                'user_email' => 'subaru@tidyup.com',
                'shop_name' => 'Subaru\'s Barber Shop',
                'email' => 'shop.subaru@tidyup.com',
                'contact_number' => '09123456791',
                'region' => 'NCR',
                'province' => 'Metro Manila',
                'city' => 'Makati',
                'barangay' => 'Barangay 25',
                'detailed_address' => '123 Main Street',
                'availability' => true,
                'is_verified' => true,
                'bio' => 'Professional salon offering quality haircuts and styling services.',
                'status' => 'approved',
                'tokens' => 50,
                'categories' => [1], // Assuming category IDs
            ],
            [
                'user_email' => 'emilia@tidyup.com',
                'shop_name' => 'Emilia\'s Beauty Parlor',
                'email' => 'shop.emilia@tidyup.com',
                'contact_number' => '09123456792',
                'region' => 'NCR',
                'province' => 'Metro Manila',
                'city' => 'Taguig',
                'barangay' => 'Barangay 12',
                'detailed_address' => '456 Park Avenue',
                'availability' => true,
                'is_verified' => true,
                'bio' => 'Premium salon providing traditional and modern styling services.',
                'status' => 'approved',
                'tokens' => 75,
                'categories' => [2], // Assuming category IDs
            ],
            [
                'user_email' => 'rem@tidyup.com',
                'shop_name' => 'Rem\'s Hair Studio',
                'email' => 'shop.rem@tidyup.com',
                'contact_number' => '09123456793',
                'region' => 'Region IV-A',
                'province' => 'Cavite',
                'city' => 'Tagaytay',
                'barangay' => 'Barangay 5',
                'detailed_address' => '789 Broadway',
                'availability' => true,
                'is_verified' => true,
                'bio' => 'Family-friendly salon catering to all ages and styles.',
                'status' => 'approved',
                'tokens' => 35,
                'categories' => [1, 2], // Assuming category IDs
            ],
            [
                'user_email' => 'ram@tidyup.com',
                'shop_name' => 'Ram\'s Grooming Lounge',
                'email' => 'shop.ram@tidyup.com',
                'contact_number' => '09123456794',
                'region' => 'Region III',
                'province' => 'Bulacan',
                'city' => 'Malolos',
                'barangay' => 'Barangay 8',
                'detailed_address' => '101 Highland Avenue',
                'availability' => true,
                'is_verified' => false,
                'bio' => 'Experienced stylists dedicated to making you look your best.',
                'status' => 'processing',
                'tokens' => 20,
                'categories' => [1], // Assuming category IDs
            ],
            [
                'user_email' => 'beatrice@tidyup.com',
                'shop_name' => 'Betty\'s Beauty Salon',
                'email' => 'shop.beatrice@tidyup.com',
                'contact_number' => '09123456795',
                'region' => 'NCR',
                'province' => 'Metro Manila',
                'city' => 'Quezon City',
                'barangay' => 'Barangay 42',
                'detailed_address' => '202 Sunset Boulevard',
                'availability' => false,
                'is_verified' => true,
                'bio' => 'Trendy salon offering the latest styles and techniques.',
                'status' => 'approved',
                'tokens' => 60,
                'categories' => [2], // Assuming category IDs
            ],
        ];

        foreach ($shops as $shopData) {
            // Find the user by email
            $user = User::where('email', $shopData['user_email'])->first();
            
            // Assign shop owner role if not already assigned
            $this->assignShopOwnerRole($user->id, $shopOwnerRole->id);
            
            // Create the shop
            $shop = Shop::create([
                'user_id' => $user->id,
                'shop_name' => $shopData['shop_name'],
                'email' => $shopData['email'],
                'contact_number' => $shopData['contact_number'],
                'shop_photo' => null,
                'region' => $shopData['region'],
                'province' => $shopData['province'],
                'city' => $shopData['city'],
                'barangay' => $shopData['barangay'],
                'detailed_address' => $shopData['detailed_address'],
                'availability' => $shopData['availability'],
                'is_verified' => $shopData['is_verified'],
                'bio' => $shopData['bio'],
                'status' => $shopData['status'],
                'rejection_reason' => null,
                'resubmit_count' => 0,
                'tokens' => $shopData['tokens'],
            ]);
            
            // Assign categories
            $this->assignCategoriesToShop($shop, $shopData['categories']);
            
            // Create operation hours
            $this->createShopOperationHours($shop);
            
            // Create legal documents
            $this->createShopLegalDocuments($shop);
            
            // Create gallery images
            $this->createShopGallery($shop);
            
            // Create shop staff (owner)
            $this->createShopOwner($shop, $user);
        }
    }
    
    /**
     * Assign shop owner role to user if not already assigned
     */
    private function assignShopOwnerRole($userId, $roleId)
    {
        $exists = DB::table('user_role')
            ->where('user_id', $userId)
            ->where('role_id', $roleId)
            ->exists();
            
        if (!$exists) {
            DB::table('user_role')->insert([
                'user_id' => $userId,
                'role_id' => $roleId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
    
    /**
     * Assign categories to shop
     */
    private function assignCategoriesToShop($shop, $categoryIds)
    {
        foreach ($categoryIds as $categoryId) {
            DB::table('shop_category')->insert([
                'shop_id' => $shop->id,
                'category_id' => $categoryId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
    
    /**
     * Create shop operation hours
     */
    private function createShopOperationHours($shop)
    {
        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        foreach ($days as $day) {
            $isOpen = in_array($day, ['sunday']) ? false : true;
            
            OperationHours::create([
                'shop_id' => $shop->id,
                'day' => $day,
                'is_open' => $isOpen,
                'open_time' => $isOpen ? '08:00:00' : null,
                'close_time' => $isOpen ? '17:00:00' : null,
            ]);
        }
    }
    
    /**
     * Create shop legal documents
     */
    private function createShopLegalDocuments($shop)
    {
        ShopLegalDocument::create([
            'shop_id' => $shop->id,
            'business_permit_url' => 'documents/business_permit_' . $shop->id . '.pdf',
            'dti_registration_url' => 'documents/dti_' . $shop->id . '.pdf',
            'valid_id_url' => 'documents/valid_id_' . $shop->id . '.jpg',
        ]);
    }
    
    /**
     * Create shop gallery images
     */
    private function createShopGallery($shop)
    {
        $defaultImagePath = 'assets/images/featuredShops.png';
        for ($i = 1; $i <= 3; $i++) {
            ShopGallery::create([
                'shop_id' => $shop->id,
                'url' => $defaultImagePath,
            ]);
        }
    }
    
    /**
     * Create shop owner record in shop staffs
     */
    private function createShopOwner($shop, $user)
    {
        ShopStaffs::create([
            'shop_id' => $shop->id,
            'staff_id' => $user->id,
            'role' => 'Owner',
            'position' => 'owner',
            'is_active' => true,
            'started_at' => now(),
            'ended_at' => null,
        ]);
    }
}