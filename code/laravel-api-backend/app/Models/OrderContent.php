<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class OrderContent extends Model
{
    protected $fillable = ['id' ,'order_id' , 'dish_id' , 'count'];
    
    protected $keyType = 'string'; 
    public $incrementing = false; 

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid()->toString();
            }
        });
    }
}
