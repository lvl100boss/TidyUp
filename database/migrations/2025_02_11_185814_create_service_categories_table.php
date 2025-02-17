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
        Schema::create('service_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        DB::table('service_categories')->insert([
            ['name' => 'Haircut', 'description' => 'Haircut service', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Hair Styling', 'description' => 'Hair Styling service', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Kid\'s Haircuts', 'description' => 'Kid\'s Haircuts service', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Others', 'description' => 'Others service', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_categories');
    }
};
