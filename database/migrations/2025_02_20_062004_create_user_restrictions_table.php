<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_restrictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->dateTime('date_restricted');
            $table->date('scheduled_lift_date'); // When it's supposed to be lifted
            $table->date('actual_lift_date')->nullable(); // When it was actually lifted
            $table->integer('duration');
            $table->foreignId('role_id')->constrained();
            $table->string('restricted_by');
            $table->string('lifted_by')->nullable(); // Who lifted the restriction
            $table->text('reason');
            $table->text('lift_reason')->nullable(); // Why it was lifted early
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_restrictions');
    }
};