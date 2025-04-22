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
            // Add the subscription_id column.
            // Assuming you have a 'subscriptions' table with an 'id' primary key.
            // Add ->after('column_name') to place it after a specific column.
            // Set the default value to 1
            $table->foreignId('subscription_id')->default(1)->constrained()->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shops', function (Blueprint $table) {
            // Drop the foreign key constraint first
            $table->dropForeign(['subscription_id']);
            // Then drop the column
            $table->dropColumn('subscription_id');
        });
    }
};
