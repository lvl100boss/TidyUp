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
        Schema::table('shops', function (Blueprint $table) {
            if (!Schema::hasColumn('shops', 'status')) {
                $table->string('status')->default('processing')->after('bio');
            }

            if (!Schema::hasColumn('shops', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('status');
            }
        });

        // Update existing shops to have a 'verified' status for backward compatibility
        DB::table('shops')
            ->whereNull('status')
            ->update(['status' => 'verified']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('rejection_reason');
        });
    }
};
