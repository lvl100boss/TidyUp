<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First check if the shop_id column exists and add it if needed
        if (!Schema::hasColumn('reviews', 'shop_id')) {
            Schema::table('reviews', function (Blueprint $table) {
                $table->foreignId('shop_id')->nullable()->after('user_id');
            });
        }

        // Then add service_rating and staff_rating
        Schema::table('reviews', function (Blueprint $table) {
            // Add columns if they don't exist
            if (!Schema::hasColumn('reviews', 'service_rating')) {
                $table->tinyInteger('service_rating')->nullable()->after('shop_id');
            }
            if (!Schema::hasColumn('reviews', 'staff_rating')) {
                $table->tinyInteger('staff_rating')->nullable()->after('service_rating');
            }
        });

        // Update existing reviews to populate service_rating and staff_rating from rating
        DB::statement('UPDATE reviews SET service_rating = rating, staff_rating = rating WHERE service_rating IS NULL AND staff_rating IS NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            if (Schema::hasColumn('reviews', 'service_rating')) {
                $table->dropColumn('service_rating');
            }
            if (Schema::hasColumn('reviews', 'staff_rating')) {
                $table->dropColumn('staff_rating');
            }
        });
    }
};
