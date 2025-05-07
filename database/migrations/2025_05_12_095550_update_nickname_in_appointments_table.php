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
        // Step 1: Update any NULL values to an empty string
        DB::table('appointments')->whereNull('nickname')->update(['nickname' => '']);

        // Step 2: Make the column NOT NULL
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('nickname')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->string('nickname')->nullable()->change();
        });
    }
};
