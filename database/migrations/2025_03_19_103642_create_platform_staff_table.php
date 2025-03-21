<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlatformStaffTable extends Migration
{
    public function up()
    {
        Schema::create('platform_staffs', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->unsignedBigInteger('user_id'); // Foreign key to users table
            $table->unsignedBigInteger('role_id'); // Foreign key to roles table
            $table->string('department');
            $table->date('date_hired');
            $table->enum('status', ['active', 'inactive', 'on_leave', 'suspended'])->default('active');
            $table->timestamps(); // Adds `created_at` and `updated_at`

            // Define foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('platform_staffs');
    }
}