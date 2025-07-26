<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CategoryController extends Controller
{
    public function index()
    {
        try {
            $categories_response = auth()->user()->resturant->Category;
            $categories = [];
            foreach ($categories_response as $cat) {
                $categories[$cat->id] = [
                    "id"=>$cat->id,
                    "name" => $cat->name,
                    "updated_at" => $cat->updated_at
                ];
            }
            return response()->json(['categories' => $categories], 200);
        }  catch (ValidationException $e) {
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

    public function create(Request $request)
    {
        try {
            $request->validate(['name' => 'required | unique:categories,name']);
            $resturant = auth()->user()->resturant;

            if (!$resturant) {
                return response()->json(['message' => "No restaurant found."], 404);
            }

            $category = $resturant->Category()->create(['name' => $request->name]);

            return response()->json([
                'category' => $category ,
            ],  201 );
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

    public function edit(Request $request , $id)
    {
        try {
            Log::info($request->all());
            $request->validate(['name' => 'required']);
            $category = Category::find($id);

            if (!$category) {
                return response()->json(['message' => 'Category not found!'], 404);
            }

            $update = $category->update(['name' => $request->name]);

            return response()->json([
                'message' => $update ? "Updated successfully" : "An unexpected error occurred. Please try again later.",
                'category' => $category
            ], $update ? 201 : 500);
        }  catch (ValidationException $e) {
            return response()->json([
                'status' => 422,
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

    public function delete($id)
    {
        try {
            $deleted = Category::destroy($id);
            return response()->json([
                'message' => $deleted ? "Deleted successfully" : "Category not found",
            ], $deleted ? 200 : 404);
        } catch (Exception $e) {
            Log::error($e); 
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }
}
