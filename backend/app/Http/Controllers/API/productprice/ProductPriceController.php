<?php

namespace App\Http\Controllers\API\productprice;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\productprice\StoreProductPriceRequest;
use App\Http\Requests\productprice\UpdateProductPriceRequest;
use App\Http\Resources\productprice\ProductPriceResource;
use App\Http\Resources\productprice\ProductPriceCollection;
use App\Repositories\productprice\ProductPriceRepositoryInterface;
use App\Services\productprice\ProductPriceService;
use Illuminate\Support\Facades\Auth;

class ProductPriceController extends Controller
{
    protected $repository;
    protected $service;

    public function __construct(
        ProductPriceRepositoryInterface $repository,
        ProductPriceService $service
    ) {
        $this->repository = $repository;
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $data = $this->repository->getDatatable($request);
        return new ProductPriceCollection($data);
    }

    public function store(StoreProductPriceRequest $request)
    {
        $validatedData = $request->validated();
        $username = Auth::user() ? Auth::user()->username : 'system';

        try {
            $this->service->storeMultiple($validatedData['items'], $username);
            return response()->json([
                'success' => true,
                'message' => 'Berhasil menyimpan harga produk'
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
        $product = $this->repository->findById($id);
        if (!$product) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $options = $this->repository->getOptions($id);
        $history = $this->repository->getHistory($id);
        $priceBefore = $this->repository->getLatestHistoryPrice($id);

        return response()->json([
            'data' => new ProductPriceResource($product),
            'options' => $options,
            'history' => $history,
            'price_before' => $priceBefore ? $priceBefore->product_price : 0
        ]);
    }

    public function update(UpdateProductPriceRequest $request, $id)
    {
        $validatedData = $request->validated();
        $username = Auth::user() ? Auth::user()->username : 'system';

        try {
            $optionsData = $validatedData['options'] ?? [];
            $perubahan = $this->service->updateSingle($id, $validatedData, $optionsData, $username);

            if (!$perubahan) {
                return response()->json([
                    'success' => true,
                    'message' => 'Data tidak ada yg berubah'
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Berhasil update harga produk'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $this->service->delete($id);
            return response()->json([
                'success' => true,
                'message' => 'Berhasil menghapus/non-aktifkan harga produk'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function availableProducts()
    {
        $products = $this->repository->getAvailableProducts();
        return response()->json($products);
    }

    public function detailBarang(Request $request)
    {
        $id_product = $request->input('id_product');
        $data = $this->repository->findDetail($id_product);

        if ($data) {
            return response()->json([
                'status' => true,
                'product_price' => $data->product_price,
                'delivery_term' => $data->delivery_term
            ]);
        }

        return response()->json([
            'status' => false
        ]);
    }
}
