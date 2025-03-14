<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShopCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Only create the table if it doesn't exist - using correct table name
        if (!Schema::hasTable('shop_category')) { // Changed from 'shop_categories' to 'shop_category'
            Schema::create('shop_category', function (Blueprint $table) { // Changed from 'shop_categories' to 'shop_category'
                $table->id();
                $table->unsignedBigInteger('shop_id');
                $table->unsignedBigInteger('category_id');
                $table->timestamps();

                // Make sure we're referencing the correct table and column names based on your schema
                $table->foreign('shop_id')->references('id')->on('shops')->onDelete('cascade');
                $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('shop_category'); // Changed from 'shop_categories' to 'shop_category'
    }
}
