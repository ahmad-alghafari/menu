<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('order_contents', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->foreignUuid("order_id")->constrained()->cascadeOnDelete();
            $table->foreignId("dish_id")->constrained("dishes" ,"id")->cascadeOnDelete();
            $table->integer('count')->default(1);
            $table->timestamps();
        });
    }

    
    public function down(): void
    {
        Schema::dropIfExists('order_contents');
    }
};
