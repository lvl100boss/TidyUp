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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('tier'); // Tier name or identifier
            $table->decimal('monthly_price', 10, 2); // Monthly price
            $table->decimal('yearly_price', 10, 2); // Yearly price
            $table->decimal('monthly_discount', 5, 2)->default(0); // Monthly discount percentage
            $table->decimal('yearly_discount', 5, 2)->default(0); // Yearly discount percentage
            $table->string('status')->default('active'); // Add status column
            $table->timestamps();
        });

        DB::table('subscriptions')->insert([
            [
                'tier' => 'Free Tier',
                'monthly_price' => 0,
                'yearly_price' => 0,
                'monthly_discount' => 0,
                'yearly_discount' => 0,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
