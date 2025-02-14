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
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('shop_name')->unique();
            $table->string('email')->unique();
            $table->string('contact_number')->nullable();
            $table->string('shop_photo')->nullable();
            $table->string('region')->nullable();
            $table->string('province')->nullable();
            $table->string('city')->nullable();
            $table->string('barangay')->nullable();
            $table->string('detailed_address')->nullable();
            $table->boolean('availability')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->text('bio')->nullable();
            $table->integer('tokens')->default(0);
            $table->timestamps();
            // $table->softDeletes(); // Added soft deletes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
