<?php
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DishController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PassportController;
use App\Http\Controllers\QrcodeController;
use App\Http\Controllers\ResturantController;
use App\Models\Resturant;
use Illuminate\Support\Facades\Route;
    
Route::post('login', [PassportController::class, 'login']);
Route::post('register', [PassportController::class, 'register']);
Route::post('logout', [PassportController::class, 'logout'])->middleware('auth:api');
Route::get('me', [PassportController::class, 'details'])->middleware('auth:api');
Route::get('verify-token', [PassportController::class, 'boollog'])->middleware('auth:api');



Route::get('/example', function () {
    return response()->json(['message' => 'API is working!'] , 200);
});

Route::get('/resturants/{id}' , function($id){
    $resturant = Resturant::with(['Category', 'Dish'])->find($id);
    if(!$resturant){
        return response()->json([
            "message" => "resturant not found"
        ],404);
    }
    if($resturant->status == 'off'){
        return response()->json([
            "message" => "menu service of this resturant is off now , try later."
        ],404);
    }
    return response()->json([
        "message" => "ok",
        "categories" => $resturant->Category,
        "dishs"=>$resturant->Dish,
        "resturant_name" => $resturant->name,

    ],200);
});

Route::middleware("auth:api")->group(function () {
    
    Route::prefix("/dishes")->group(function () {
        Route::get("/", [DishController::class, 'index']);
        Route::post("/", [DishController::class, 'create']);
        Route::post("/edit", [DishController::class, 'update']);
        Route::delete("/{id}", [DishController::class, 'delete']);
        Route::put("/status/{id}", [DishController::class, 'updateStatus']);
        Route::get("/{id}", [DishController::class, 'item']);
    });

    Route::prefix("/orders")->group(function () {
        Route::get("/", [OrderController::class, 'index']);
        Route::post('/', [OrderController::class , 'create']);
        Route::delete('/{id}', [OrderController::class , 'delete']);
        Route::get("/implemented", [OrderController::class, 'implementedOrders']);
        Route::put("/implement/{id}", [OrderController::class, 'implementOrder']);
    });

    Route::prefix("/categories")->group(function () {
        Route::get("/", [CategoryController::class, 'index']);
        Route::post("/", [CategoryController::class, 'create']);
        Route::put("/{id}", [CategoryController::class, 'edit']);
        Route::delete("/{id}", [CategoryController::class, 'delete']);
    });

    Route::prefix("/QRcode")->group(function () {
        Route::get('/', [QrcodeController::class, 'index']);
        Route::post('/', [QrcodeController::class, 'create']);
        Route::delete('/{id}', [QrcodeController::class, 'destroy']);
    });

    // Route::prefix("/resturants")->group(function(){
    //     Route::get("/" , [ResturantController::class , 'index']);
    //     Route::get("/{name}", [ResturantController::class , 'item']);
    //     Route::post("/" , [ResturantController::class , 'create']);
    //     Route::delete("/{id}" , [ResturantController::class , 'delete']);
    // });
});