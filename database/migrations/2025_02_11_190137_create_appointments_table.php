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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('shop_id')->constrained('shops')->onDelete('cascade');
            $table->foreignId('approved_by')->nullable()->constrained('shop_staffs')->onDelete('cascade');
            $table->date('date');
            $table->time('time');
            $table->enum('status', ['pending', 'upcoming', 'completed', 'cancelled', 'no-show', 'declined', 'started'])->default('pending');
            $table->decimal('total_price', 10, 2);
            $table->text('note')->nullable();
            $table->boolean('is_successful')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
