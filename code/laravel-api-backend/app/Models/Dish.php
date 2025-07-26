<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dish extends Model
{
    protected $fillable = ['id' ,'resturant_id' ,'name','price','availability','description','category_id' ,'discount', 'path'];

    public function BelongToResturant():BelongsTo{
        return $this->belongsTo(Resturant::class);
    }

    public function Category() : BelongsTo {
        return $this->belongsTo(Category::class);
    }

}
