<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('orders-channel-{restaurantId}', function ($user, $restaurantId) {
    return $user->isAdminOfRestaurant($restaurantId);
});
