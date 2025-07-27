<?php

namespace App\Jobs;

use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class DeleteOrder implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public $id)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $query = Order::destroy($this->id); 
    }
}
