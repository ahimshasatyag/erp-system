<?php

namespace App\Http\Controllers\API\po;

use App\Http\Controllers\Controller;
use App\Http\Requests\po\StorePoRequest;
use App\Http\Requests\po\UpdatePoRequest;
use App\Http\Resources\po\PoResource;
use App\Services\po\PoService;
use App\Actions\po\ConfirmPoAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PoController extends Controller
{
    protected $service;

    public function __construct(PoService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $data = $this->service->getDatatable($request);
        return PoResource::collection($data);
    }

    public function store(StorePoRequest $request)
    {
        try {
            $file = $request->file('file');
            $po = $this->service->create($request->validated(), $file);
            return response()->json([
                'success' => true,
                'message' => 'PO created successfully.',
                'data' => new PoResource($po)
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
            $po = $this->service->getById($id);
            return new PoResource($po);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'PO not found.'
            ], 404);
        }
    }

    public function update(UpdatePoRequest $request, $id)
    {
        try {
            $file = $request->file('file');
            $po = $this->service->update($id, $request->validated(), $file);
            return response()->json([
                'success' => true,
                'message' => 'PO updated successfully.',
                'data' => new PoResource($po)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function confirm(Request $request, ConfirmPoAction $action)
    {
        $request->validate(['id_po' => 'required|integer']);

        try {
            $action->execute($request->id_po);
            return response()->json(['status' => true, 'message' => 'PO confirmed successfully.']);
        } catch (\Exception $e) {
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // --- HELPER ENDPOINTS ---
    // Sering digunakan untuk mengisi form sesuai CI legacy: data_supplier, data_gudang, dll.
    
    public function getMasterData()
    {
        // Equivalent to data_supplier, data_gudang, data_product in Mmaster.php
        return response()->json([
            'suppliers' => DB::table('m_suppliers')->select('id_suppliers', 'nm_suppliers')->get(),
            'gudang' => DB::table('m_gudang')->select('id_gudang', 'nm_gudang')->get(),
            'products' => DB::table('m_product')->select('id_product', 'code_product', 'nm_product', 'product_deskripsi')->get(),
            'mata_uang' => DB::table('m_mata_uang')->select('id_mata_uang', 'name')->get()
        ]);
    }

}
