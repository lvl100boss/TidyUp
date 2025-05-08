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
            $table->boolean('staff_booked')->default(false)->after('is_successful');
        });

        Schema::table('user_appointments', function (Blueprint $table) {
            $table->boolean('is_staff_booking')->default(false)->after('staff_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropColumn('staff_booked');
        });

        Schema::table('user_appointments', function (Blueprint $table) {
            $table->dropColumn('is_staff_booking');
        });
    }
};
