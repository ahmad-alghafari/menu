<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;


use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Order;
use App\Models\OrderContent;
use App\Models\Resturant;
// use App\Events\OrderNotification;

class AddOrder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $resturant_id ;
    public $table_number ;
    public $order_contents ;

    public $tries = 3; 
    public $retryAfter = 5;

public function __construct(
    $res_id , 
    $tab_num ,
    $ord_cont ,
)
{
    $this->resturant_id = $res_id;
    $this->table_number =$tab_num;
    $this->order_contents = $ord_cont;
}

public function handle(): void
{
    
    $order = Order::create([
        'resturant_id' => $this->resturant_id ,
        'table_number' => $this->table_number ,
    ]);

   
    foreach ($this->order_contents as $dish_id => $quantity) {
        OrderContent::create([
            'order_id' => $order->id,
            'dish_id' => intval($dish_id),
            'count' => intval($quantity),
        ]);

    }
    Resturant::where('id', $this->resturant_id)->increment('orders_number');
    $order = $order->load(['Content', 'Resturant.User']);
    $orderData = [
        'id' => $order->id,
        'table_number' => $order->table_number,
        'created_at' => $order->created_at,
        'content' => $order->Content->map(function ($content) {
            return [
                'dish_id' => $content->dish_id,
                'count' => $content->count,
            ];
        }),
    ];
    // MonthlyOrderNotification::dispatch($orderData);
}
}
