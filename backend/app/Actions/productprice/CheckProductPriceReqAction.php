<?php

namespace App\Actions\productprice;

use App\Models\productprice\ProductPriceReq;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CheckProductPriceReqAction
{
    public function execute($id_product)
    {
        // Mmaster.php check_product_price_req()
        $requests = ProductPriceReq::where('m_product_price_req.id_product', $id_product)
            ->where('m_product_price_req.f_kirim', 9)
            ->join('m_product', 'm_product_price_req.id_product', '=', 'm_product.id_product')
            ->select('m_product_price_req.id', 'm_product_price_req.username', 'm_product.code_product', 'm_product.nm_product')
            ->get();

        foreach ($requests as $req) {
            $user = User::where('username', $req->username)->first();

            if ($user && !empty($user->phone)) {
                $phone = $user->phone;
                
                $pesan = "Permintaan Update Harga Anda\n";
                $pesan .= "Kode Barang: " . $req->code_product . "\n";
                $pesan .= "Nama Barang: " . $req->nm_product . "\n\n";
                $pesan .= "STATUS: *SUDAH DI UPDATE*";

                if (function_exists('whatsapp_config') && function_exists('pesan_text')) {
                    $data_device = whatsapp_config();
                    $device_id = $data_device['device_id'] ?? null;
                    
                    if ($device_id) {
                        $dataa = pesan_text($device_id, $phone, $pesan);
                        
                        DB::table('m_whatsapp_message_pending')->insert([
                            'data' => json_encode($dataa),
                            'date' => current_datetime(), // assuming this helper exists
                            'status' => 'Pending'
                        ]);
                    }
                }

                // Update f_kirim
                $req->update(['f_kirim' => 1]);
            }
        }
    }
}
