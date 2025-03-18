<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Check if the column already exists
        if (!Schema::hasColumn('users', 'middle_name')) {
            // Add middle_name column after first_name
            Schema::table('users', function (Blueprint $table) {
                $table->string('middle_name')->nullable()->after('first_name');
            });
        } else {
            // If it exists but needs to be nullable, use raw SQL
            DB::statement('ALTER TABLE `users` MODIFY `middle_name` VARCHAR(255) NULL');
        }
    }

    public function down()
    {
        // Only attempt to modify if the column exists
        if (Schema::hasColumn('users', 'middle_name')) {
            DB::statement('ALTER TABLE `users` MODIFY `middle_name` VARCHAR(255) NOT NULL DEFAULT ""');
        }
    }
};