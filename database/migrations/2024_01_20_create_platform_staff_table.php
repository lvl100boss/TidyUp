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
        Schema::create('platform_staffs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('role');
            $table->string('position');
            $table->boolean('is_active')->default(true);
            $table->timestamp('started_at')->nullable(); // Added started_at timestamp
            $table->timestamp('ended_at')->nullable(); // Added ended_at timestamp
            $table->timestamps();

            $table->index(['user_id']); // Added index for better performance on shop_id and staff_id
            $table->softDeletes(); // Added soft deletes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('platform_staffs');
    }
};
