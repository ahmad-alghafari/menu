<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\QRcodeImage;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;



class QrcodeController extends Controller
{
    public function index(){
        try{
            $QRcodes_response = auth()->user()->resturant->Qrcode;
            $QRcodes = [];
            foreach ($QRcodes_response as $code) {
                $QRcodes += [$code->id => $code];
            }
            return response()->json(['QRcodes' => $QRcodes] , 200);
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
        try{
            $request->validate([
                'id' => 'required|numeric | min:1|max:999',
            ]);
            $table_number = $request->id;
            $resturant = auth()->user()->resturant;
            $check = $resturant->Qrcode()->where('table_number' , $table_number )->first(); 
            $content = env("APP_URL") . ':8000/seless/menu/' . $resturant->name . "/" . $table_number ; 
            $path = 'images/QRcode/qrcode_'.$resturant->name . '_' . $table_number .'.png';
            QrCode::format('png')->size(400)->generate($content, public_path($path));
            if(!$check){
                $newQRcode = QRcodeImage::create([
                    'resturant_id' => $resturant->id ,
                    'table_number' => $table_number ,
                    'path' => $path
                ]);
            }else {
                $newQRcode = $check; 
            }
            return response()->json([
                'QRcode' => $newQRcode
            ] , 200);
        }catch (ValidationException $e) {
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

    public function destroy($id){
        try{
            $table = auth()->user()->resturant->Qrcode()->where('id' , $id)->first();

            if($table){
                $oldPath = public_path($table->path);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
                $table->delete();
                return response()->json(['message' => "deleted successfully"] ,200);
            }else{
                return response()->json(['message' => "table not found"] ,404);
                
            }
            
        }catch (ValidationException $e) {
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
    
}
