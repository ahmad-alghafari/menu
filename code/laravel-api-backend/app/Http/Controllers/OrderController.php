<?php

namespace App\Http\Controllers;

use App\Jobs\AddOrder;
use App\Jobs\DeleteOrder;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller {
    public function index(){
        try {
            $orders_response = auth()->user()->Resturant->Order()->with('Content')->get();
            $orders = [];

            foreach ($orders_response as $order) {
                $orders[$order->id] = $order;
            }

            return response()->json(['orders' => $orders], 200);
        } catch (Exception $e) {
            Log::error($e); 
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }

    

    public function create(Request $request) {
        try {
            $request->validate([
                'resturant_id' => 'required|integer|exists:resturants,id',
                'table_number' => 'required|integer|min:1',
                'order_contents' => 'required',
            ], [
                'resturant_id.required' => 'Restaurant ID is required!',
                'resturant_id.integer' => 'Restaurant ID should be a number!',
                'resturant_id.exists' => 'Restaurant ID does not match with restaurants table records!',
                'table_number.required' => 'Table number is required!',
                'table_number.integer' => 'Table number should be a number!',
                'table_number.min' => 'Table number should be at least 1!',
                'order_contents.required' => 'Order contents are required!',
            ]);
    
            AddOrder::dispatch($request->resturant_id, $request->table_number, $request->order_contents);
            return response()->json(['message'=>'accept request but not executed yet'],202);
    
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (Exception $e) {
            Log::error($e); 
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }

    public function implementedOrders(){
        try {
            $Resturant = Auth::user()->Resturant;

            $orders = [];
            $temp_orders = $Resturant->Order()
                    ->select('id', 'table_number', 'created_at')
                    ->with(['Content' => function ($query) {
                        $query->select('id', 'dish_id', 'count', 'order_id');
                    }])
                    ->where('implemented', 'true')
                    ->orderBy('created_at', 'desc')
                    ->get();

            foreach ($temp_orders as $order) {
                $orders[$order->id] = $order;
            }

            if ($orders) {
                return response()->json(['orders' => $orders,], 200);
            }

            return response()->json(['message' => 'No orders found'], 404);
        }  catch (Exception $e) {
            Log::error($e); 
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.',
            ], 500);
        }
    }

    public function implementOrder($id){
        try {
            $query = Auth::user()->Resturant->Order()
                    ->where('id', $id)
                    ->update(['implemented' => 'true']);

                return response()->json(['message' => 
                $query ? 'update successfully':'updated not implement'
                ], 
                $query ? 204:501);

            return response()->json(['message' => 'Unable to update order implementation status'], 501);
        } catch (Exception $e) {
            Log::error($e); 
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }

    public function delete($id){
        try{
            $order = Order::find($id);
            if($order){
                DeleteOrder::dispatch($id);
                return response()->json([
                    'message' => "accepet request but not executed yet"
                ],202);
            } else {
                return response()->json([
                    'message' => "not found"
                ],404);
            }

        }catch (Exception $e) {
            Log::error($e); 
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }
}