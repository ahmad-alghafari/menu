<?php

namespace App\Http\Controllers;

use App\Models\Resturant;
use Illuminate\Http\Request;

class ResturantController extends Controller
{
    public function index(){
        return response()->json([
            'resturant'=> Resturant::all()
        ],200);
    }

    public function create(Request $request){
        $request->validate([
            'name' => 'required',
            'user_id' => 'required',
            'price' => 'required'
        ]);
        $resturant = Resturant::create([
            'user_id'=>$request->user_id,
            'name'=>$request->name,
            'service_price'=>$request->price,
            'orders_number'=>0,
            'tamplate_number'=>'1',
            'status'=>'run'
        ]);
        return response()->json(['message'=>'created successfully' , 'resturant'=>$resturant],201);
    }

    public function item($name){
        $resturant = Resturant::where('name',$name)->first();
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
            "categories" => $resturant->Category,
            "dishs"=>$resturant->Dish,
            "resturant_name" => $resturant->name,
        ],200);
    }

    public function delete($id){
        $query = Resturant::destroy($id);
        return response()->json([
            'message' => $query ? 'deleted successfully':'not found' 
        ] , 
            $query ? 204 : 404
        );
    }
}


