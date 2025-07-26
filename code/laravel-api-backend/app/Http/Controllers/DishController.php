<?php

namespace App\Http\Controllers;

use App\Models\dish;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

use function Laravel\Prompts\error;

class DishController extends Controller
{
    public function index()
    {
        try {
            $dishes_response = auth()->user()->resturant->dish;

            $dishes = [];
            foreach ($dishes_response as $fo) {
                $dishes[$fo->id] = $fo;
            }

            return response()->json([
                'dishes' => $dishes,
            ], 200);
        } catch (Exception $e) {
            Log::error($e); 
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }

    public function item($id)
    {
        try {
            $food = dish::where('id', $id)->with("Category:id,name")->first();
            if (!$food) {
                return response()->json(['message' => 'Not found'], 404);
            }

            $categories_response = auth()->user()->resturant->Category;
            $categories = [];
            foreach ($categories_response as $cat) {
                $categories[$cat->id] = $cat->name;
            }

            return response()->json([
                'food' => $food,
                'categories' => $categories,
            ], 200);
        }catch (Exception $e) {
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
            $request->validate([
                'name' => 'required | unique:dishes,name',
                'price' => 'required | numeric',
                'description' => 'required',
                'category_id' => 'required|exists:categories,id',
                'file' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
            ]);

            $resturant = auth()->user()->resturant;
            $filePath = '';

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = time() . '.' . $resturant->id . '.' . $file->extension();
                $filePath = env('APP_URL') . ':8000'."/images/food/" . $fileName;
                $file->move(public_path('images/food'), $fileName);
            }

            $dish = $resturant->Dish()->create([
                'name' => $request->name,
                'price' => $request->price,
                'description' => $request->description,
                'category_id' => $request->category_id,
                'path' => $filePath,
                'availability' => 'available',
            ]);

            return response()->json(['dish' => $dish], 201);
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
                'message' => 'An unexpected error occurred. Please try again later.',
                'error' => $e
            ], 500);
        }
    }

    public function update(Request $request )
    {
        try {
            $request->validate([
                'id' => 'required | exists:dishes,id',
                'name' => 'required',
                'price' => 'required|numeric',
                'description' => 'required',
                'category_id' => 'required',
                'file' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            ]);

            $food = dish::find($request->id);

            $filePath = $food->path;
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $fileName = time() . '.' . $request->id . '.' . $file->extension();
                $filePath = env('APP_URL') . ':8000'."images/food/" . $fileName;
                $file->move(public_path('images/food'), $fileName);

                $oldPath = public_path($food->path);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }

            $food->update([
                'name' => $request->name,
                'price' => $request->price,
                'description' => $request->description,
                'category_id' => $request->category_id,
                'path' => $filePath,
            ]);

            return response()->json(['dish' => $food], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error'
            ], 422);
        } catch (Exception $e) {
            Log::error($e); 
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.',
                'e' => $e
            ], 500);
        }
    }

    public function delete($id)
    {
        try {
            $food = dish::find($id);
            if (!$food) {
                return response()->json(['message' => 'Food item not found.'], 404);
            }

            $oldPath = public_path($food->path);
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
            $food->delete();

            return response()->noContent();
        } catch (Exception $e) {
            Log::error($e); 
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }

    public function updateStatus(Request $request , $id)
    {
        try {
            $food = dish::find($id);
            if (!$food) {
                return response()->json(['message' => 'dish item not found.'], 404);
            }

            $food->update(['availability' => $request->status]);

            return response()->noContent();
        } catch (Exception $e) {
            Log::error($e); 
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }

    
}
