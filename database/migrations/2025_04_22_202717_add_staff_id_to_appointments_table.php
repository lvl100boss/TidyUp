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
            //add staff_id column to appointments table after shop_id column
            $table->unsignedBigInteger('staff_id')->after('shop_id')->nullable();
            //add foreign key constraint to staff_id column
            $table->foreign('staff_id')->references('id')->on('shop_staffs')->onDelete('cascade');
            //add index to staff_id column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            //drop foreign key constraint
            $table->dropForeign(['staff_id']);
            //drop staff_id column
            $table->dropColumn('staff_id');
            //drop index from staff_id column
        });
    }
};
