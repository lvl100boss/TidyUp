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
        Schema::create('shop_service_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_category_id')->constrained('service_categories')->onDelete('cascade');
            $table->string('service_name');
            $table->decimal('cost', 10, 2);
            $table->unsignedTinyInteger('duration_hour');
            $table->unsignedTinyInteger('duration_minute');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_service_categories');
    }
};
