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
        Schema::create('dishes', function (Blueprint $table) {
            $table->id();
            $table->foreignId("resturant_id")->constrained()->cascadeOnDelete();
            $table->foreignId("category_id")->constrained("categories","id")->cascadeOnDelete();
            $table->string("name");
            $table->integer("price");
            $table->enum("availability",['available' ,'not_available']);
            $table->string("description")->nullable($value = true);
            $table->integer("discount")->nullable($value = true);
            $table->string('path');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dishes');
    }
};
