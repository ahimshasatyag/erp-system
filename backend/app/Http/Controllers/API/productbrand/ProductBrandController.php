<?php

namespace App\Http\Controllers\API\productbrand;

use App\Http\Controllers\Controller;
use App\Http\Requests\productbrand\StoreProductBrandRequest;
use App\Http\Requests\productbrand\UpdateProductBrandRequest;
use App\Http\Resources\productbrand\ProductBrandCollection;
use App\Http\Resources\productbrand\ProductBrandResource;
use App\Repositories\productbrand\ProductBrandRepositoryInterface;
use App\Services\productbrand\ProductBrandService;
use App\Actions\productbrand\DeleteProductBrandAction;
use Illuminate\Http\Request;

class ProductBrandController extends Controller
{
    protected $repository;
    protected $service;

    public function __construct(ProductBrandRepositoryInterface $repository, ProductBrandService $service)
    {
        $this->repository = $repository;
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $brands = $this->repository->getDatatable($request);
        return new ProductBrandCollection($brands);
    }

    public function store(StoreProductBrandRequest $request)
    {
        $brand = $this->service->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Product Brand berhasil ditambahkan',
            'data' => new ProductBrandResource($brand)
        ], 201);
    }

    public function show($id)
    {
        $brand = $this->repository->findById($id);

        if (!$brand) {
            return response()->json([
                'success' => false,
                'message' => 'Product Brand tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new ProductBrandResource($brand)
        ]);
    }

    public function update(UpdateProductBrandRequest $request, $id)
    {
        $brand = $this->service->update($id, $request->validated());

        if (!$brand) {
            return response()->json([
                'success' => false,
                'message' => 'Product Brand tidak ditemukan atau gagal diupdate'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product Brand berhasil diupdate',
            'data' => new ProductBrandResource($brand)
        ]);
    }

    public function destroy($id, DeleteProductBrandAction $deleteAction)
    {
        $deleted = $deleteAction->execute($id);

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Product Brand tidak ditemukan atau gagal dihapus'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Product Brand berhasil dihapus'
        ]);
    }
}
