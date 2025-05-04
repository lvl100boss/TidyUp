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
        Schema::table('appointment_services', function (Blueprint $table) {
            $table->foreignId('staff_id')->nullable()->after('attendee_id')->constrained('shop_staffs')->onDelete('set null');
        });

        // Create index for faster availability checks
        Schema::table('appointments', function (Blueprint $table) {
            $table->index(['staff_id', 'date', 'time'], 'appointments_staff_availability_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointment_services', function (Blueprint $table) {
            $table->dropForeign(['staff_id']);
            $table->dropColumn('staff_id');
        });

        Schema::table('appointments', function (Blueprint $table) {
            $table->dropIndex('appointments_staff_availability_index');
        });
    }
};
