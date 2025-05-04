<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migration.
     */
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->boolean('is_user_confirmed')->default(false)->after('is_successful');
            $table->timestamp('completed_at')->nullable()->after('approved_by');
            $table->unsignedBigInteger('completed_by')->nullable()->after('approved_by');
            $table->foreign('completed_by')->references('id')->on('shop_staffs')->onDelete('set null');
        });
    }

    /**
     * Reverse the migration.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->dropForeign(['completed_by']);
            $table->dropColumn(['is_user_confirmed', 'completed_by', 'completed_at']);
        });
    }
};
