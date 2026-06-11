<?php

namespace App\Http\Controllers\API\suppliers;

use App\Http\Controllers\Controller;
use App\Http\Requests\suppliers\StoreSupplierRequest;
use App\Http\Requests\suppliers\UpdateSupplierRequest;
use App\Http\Resources\suppliers\SupplierCollection;
use App\Http\Resources\suppliers\SupplierResource;
use App\Repositories\suppliers\SupplierRepositoryInterface;
use App\Services\suppliers\SupplierService;
use App\Actions\suppliers\DeleteSupplierAction;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    protected $repository;
    protected $service;

    public function __construct(SupplierRepositoryInterface $repository, SupplierService $service)
    {
        $this->repository = $repository;
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $suppliers = $this->repository->getDatatable($request);
        return new SupplierCollection($suppliers);
    }

    public function store(StoreSupplierRequest $request)
    {
        $supplier = $this->service->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Supplier berhasil ditambahkan',
            'data' => new SupplierResource($supplier)
        ], 201);
    }

    public function show($id)
    {
        $supplier = $this->repository->findById($id);

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'Supplier tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new SupplierResource($supplier)
        ]);
    }

    public function update(UpdateSupplierRequest $request, $id)
    {
        $supplier = $this->service->update($id, $request->validated());

        if (!$supplier) {
            return response()->json([
                'success' => false,
                'message' => 'Supplier tidak ditemukan atau gagal diupdate'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Supplier berhasil diupdate',
            'data' => new SupplierResource($supplier)
        ]);
    }

    public function destroy($id, DeleteSupplierAction $deleteAction)
    {
        $deleted = $deleteAction->execute($id);

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Supplier tidak ditemukan atau gagal dihapus'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Supplier berhasil dihapus'
        ]);
    }
}
