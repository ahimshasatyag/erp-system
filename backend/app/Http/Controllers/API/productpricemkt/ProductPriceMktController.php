<?php

namespace App\Http\Controllers\API\productpricemkt;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\productpricemkt\ProductPriceMktService;
use App\Http\Requests\productpricemkt\AddToCartRequest;
use App\Http\Resources\productpricemkt\ProductPriceMktResource;

class ProductPriceMktController extends Controller
{
    protected $service;

    public function __construct(ProductPriceMktService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the product prices.
     */
    public function index()
    {
        $data = $this->service->getList();
        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }

    /**
     * Display the specified product price detail.
     */
    public function show($id, Request $request)
    {
        $username = $request->user() ? $request->user()->username : 'system';
        $data = $this->service->getDetail($id, $username);

        return response()->json($data);
    }

    /**
     * Add product to cart.
     */
    public function addToCart(AddToCartRequest $request)
    {
        $this->service->addToCart($request->id_product);

        return response()->json([
            'status' => true,
            'message' => 'Berhasil ditambahkan ke keranjang'
        ]);
    }

    /**
     * Get data for generating PDF.
     */
    public function getPdf($id)
    {
        $data = $this->service->getPdfData($id);

        if (!$data) {
            return response()->json([
                'status' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        // Ideally, here you would generate the PDF using a library like DOMPDF
        // and return the binary stream or download response.
        // For API architecture, returning the data so the frontend can render it,
        // or returning a temporary URL to a generated PDF is common.
        
        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }
}
