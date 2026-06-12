<?php

namespace App\Http\Controllers\API\quotationsap;

use App\Http\Controllers\Controller;
use App\Http\Requests\quotationsap\StoreQuotationApRequest;
use App\Http\Requests\quotationsap\UpdateQuotationApRequest;
use App\Http\Resources\quotationsap\QuotationApResource;
use App\Services\quotationsap\QuotationApService;
use App\Actions\quotationsap\ConfirmQuotationApAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuotationApController extends Controller
{
    protected $service;

    public function __construct(QuotationApService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $data = $this->service->getDatatable($request);
        return QuotationApResource::collection($data);
    }

    public function store(StoreQuotationApRequest $request)
    {
        try {
            $file = $request->file('link_file');
            $quotation = $this->service->create($request->validated(), $file);
            return response()->json([
                'success' => true,
                'message' => 'Quotation AP created successfully.',
                'data' => new QuotationApResource($quotation)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $quotation = $this->service->getById($id);
            return new QuotationApResource($quotation);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Quotation AP not found.'
            ], 404);
        }
    }

    public function update(UpdateQuotationApRequest $request, $id)
    {
        try {
            $file = $request->file('link_file');
            $quotation = $this->service->update($id, $request->validated(), $file);
            return response()->json([
                'success' => true,
                'message' => 'Quotation AP updated successfully.',
                'data' => new QuotationApResource($quotation)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function confirm(Request $request, ConfirmQuotationApAction $action)
    {
        $request->validate(['id_po' => 'required|integer']);

        try {
            $action->execute($request->id_po);
            return response()->json(['status' => true, 'message' => 'Confirmed successfully.']);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function cancel(Request $request)
    {
        $request->validate(['id_po' => 'required|integer']);

        try {
            $this->service->cancel($request->id_po);
            return response()->json(['status' => true, 'message' => 'Cancelled successfully.']);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // Helper endpoints for frontend dropdowns similar to legacy Cform.php
    public function getMataUangDefault(Request $request)
    {
        $id_supplier = $request->id_supplier;
        $data = DB::table('m_suppliers')->where('id_suppliers', $id_supplier)->select('id_mata_uang')->first();
        return response()->json($data);
    }

    public function getProductDetail(Request $request)
    {
        $id_product = $request->id_product;
        // Replicating legacy query
        $product = DB::table('m_product as a')
            ->join('m_product_satuan as b', 'a.id_product_satuan', '=', 'b.id_product_satuan')
            ->where('a.id_product', $id_product)
            ->select('a.nm_product', 'a.product_deskripsi', 'b.nm_product_satuan')
            ->first();

        if ($product) {
            $options = DB::table('m_product_price_opt')
                ->where('id_product', $id_product)
                ->select('nm_product_opt')
                ->get();
            $product->options = $options;
        }

        return response()->json($product);
    }

    public function getLokasi(Request $request)
    {
        $id_gudang = $request->id_gudang;
        $data = DB::table('m_product_lokasi')->where('id_gudang', $id_gudang)->get();
        return response()->json($data);
    }
}
