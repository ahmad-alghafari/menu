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
        Schema::create('resturants', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->integer("orders_number")->default(0);
            $table->foreignId("user_id")->constrained()->cascadeOnDelete();
            $table->string("tamplate_number")->default('1');
            $table->integer("service_price");
            $table->enum("status",["run","off"]);
            $table->string("path_website_hero");
            $table->string("path_brand");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resturants');
    }
};
