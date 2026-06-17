<?php

namespace App\Services\productpricemkt;

use App\Repositories\productpricemkt\ProductPriceMktRepository;
use Illuminate\Support\Facades\Session;

class ProductPriceMktService
{
    protected $repository;

    public function __construct(ProductPriceMktRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getList()
    {
        return $this->repository->getProductList();
    }

    public function getDetail($id_product, $username = 'system')
    {
        $data = $this->repository->getDetailBarang1($id_product);

        if (!$data) {
            return [
                'status' => false
            ];
        }

        // Log search history
        $this->repository->insertHistory($id_product, $username);

        $waktu = $data->date_update;
        $action = "";
        $statusWaktu = null; // To keep track of color indicator for the API

        if ($waktu) {
            $diff = now()->diffInDays(\Carbon\Carbon::parse($waktu));
            $lastModifiedDays = config('app.last_modified', 30); // fallback 30 if setting not found
            
            // In CI: if ($hari <= setting_value('last_modified'))
            if ($diff <= $lastModifiedDays) {
                $statusWaktu = 'green';
            } else {
                $statusWaktu = 'red';
            }
        }

        // If no update date, check from history
        if (!$waktu) {
            $historyWaktu = $this->repository->getLatestHistoryWaktu($id_product);
            if ($historyWaktu) {
                $waktu = $historyWaktu;
                $diff = now()->diffInDays(\Carbon\Carbon::parse($waktu));
                $lastModifiedDays = config('app.last_modified', 30);

                if ($diff <= $lastModifiedDays) {
                    $statusWaktu = 'green';
                } else {
                    $statusWaktu = 'red';
                }
            }
        }

        $kurs = $this->getKurs();

        // Options
        $optionsData = $this->repository->getOptions($id_product);
        $options = [];
        foreach ($optionsData as $row) {
            $options[] = [
                'nm_product_opt' => $row->nm_product_opt,
                'amount' => $row->amount,
                'kurs' => $kurs,
                'estimasi' => $kurs * $row->amount
            ];
        }

        return [
            'status' => true,
            'id_product' => $data->id_product,
            'code_product' => $data->code_product,
            'nm_product' => $data->nm_product,
            'product_price' => $data->product_price,
            'date_create' => $waktu ? date("d-M-Y", strtotime($waktu)) : "",
            'status_waktu' => $statusWaktu, // Frontend can use this to determine color (green/red)
            'kurs_bank' => $kurs,
            'estimasi' => $kurs * $data->product_price,
            'id_product_global' => encrypt($data->id_product), // using laravel encrypt
            'link_brosur' => $data->link_brosur,
            'product_deskripsi' => $data->product_deskripsi,
            'data_options' => $options
        ];
    }

    public function addToCart($id_product)
    {
        $cart = Session::get('keranjang', []);
        
        $key = array_search($id_product, array_column($cart, 'id_product'));

        if ($key !== false) {
            $cart[$key]['qty'] += 1;
        } else {
            $cart[] = [
                'id_product' => $id_product,
                'qty' => 1,
            ];
        }

        Session::put('keranjang', $cart);

        return true;
    }

    public function getPdfData($id_product)
    {
        $kurs = $this->getKurs();
        return $this->repository->getDetailBarang($id_product, $kurs);
    }

    protected function getKurs()
    {
        $kurs = 15000;
        if(function_exists('kurs_usd') && function_exists('pembulatan_kurs')){
            $kurs = pembulatan_kurs(kurs_usd());
        }
        return $kurs;
    }
}
