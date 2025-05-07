<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Add nickname column if it doesn't exist
            if (!Schema::hasColumn('appointments', 'nickname')) {
                $table->string('nickname')->nullable()->after('user_id');
            }

            // Then add booking_for_other (now safely after nickname)
            $table->boolean('booking_for_other')->default(false)->after('nickname');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('booking_for_other');
            $table->dropColumn('nickname');
        });
    }
};
