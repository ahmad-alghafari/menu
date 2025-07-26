<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Resturant extends Model
{

    protected $fillable = ['id' , 'name' ,'orders_number' ,'user_id' ,'tamplate_number','service_price','status',
    'path_website_hero','path_brand'];
    
    public function Order() : HasMany{
        return $this->HasMany(Order::class);
    }

    public function Category() : HasMany{
        return $this->HasMany(Category::class);
    }

    public function Dish() : HasMany{
        return $this->HasMany(Dish::class);
    }

    public function Qrcode() : HasMany{
        return $this->HasMany(Qrcode::class);
    }

    
    public function User(): BelongsTo{
        return $this->belongsTo(User::class );
    }

}
