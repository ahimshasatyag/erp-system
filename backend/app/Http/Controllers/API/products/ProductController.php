<?php

namespace App\Http\Controllers\API\products;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\products\StoreProductRequest;
use App\Http\Requests\products\UpdateProductRequest;
use App\Http\Requests\products\StoreProductBrandRequest;
use App\Http\Resources\products\ProductResource;
use App\Http\Resources\products\ProductCollection;
use App\Repositories\products\ProductRepositoryInterface;
use App\Services\products\ProductService;
use App\Actions\products\ChangeProductStatusAction;

class ProductController extends Controller
{
    protected $productRepository;
    protected $productService;

    public function __construct(
        ProductRepositoryInterface $productRepository,
        ProductService $productService
    ) {
        $this->productRepository = $productRepository;
        $this->productService = $productService;

        // Apply policy
        // $this->authorizeResource(Product::class, 'product');
    }

    /**
     * Equivalent to index() / data_table()
     */
    public function index(Request $request)
    {
        // Add policy check if needed
        // $this->authorize('viewAny', Product::class);

        $data = $this->productRepository->getDatatable($request);
        return new ProductCollection($data);
    }

    /**
     * Equivalent to simpan()
     */
    public function store(StoreProductRequest $request)
    {
        // $this->authorize('create', Product::class);

        $validatedData = $request->validated();
        
        $brosurFile = $request->file('link_brosur');
        $fotoFile = $request->file('link_foto');

        try {
            $product = $this->productService->createProduct($validatedData, $brosurFile, $fotoFile);
            return response()->json([
                'success' => true,
                'data' => new ProductResource($product),
                'message' => 'Product created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show single product for edit/view
     */
    public function show($id)
    {
        $product = $this->productRepository->findById($id);
        if (!$product) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return new ProductResource($product);
    }

    /**
     * Equivalent to update()
     */
    public function update(UpdateProductRequest $request, $id)
    {
        // $this->authorize('update', Product::class);

        $validatedData = $request->validated();

        $brosurFile = $request->file('link_brosur');
        $fotoFile = $request->file('link_foto');

        try {
            $product = $this->productService->updateProduct($id, $validatedData, $brosurFile, $fotoFile);
            return response()->json([
                'success' => true,
                'data' => new ProductResource($product),
                'message' => 'Product updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Equivalent to cari_brand()
     */
    public function cariBrand(Request $request)
    {
        $keyword = $request->input('cari', '');
        $brands = $this->productRepository->searchBrand($keyword);
        return response()->json($brands);
    }

    /**
     * Equivalent to simpan_brand()
     */
    public function simpanBrand(StoreProductBrandRequest $request)
    {
        $id = strtoupper($request->input('new_id_product_brand'));
        $existing = $this->productRepository->findBrandByName($id);

        if (!$existing) {
            $brand = $this->productRepository->createBrand($id, $id);
            return response()->json([
                'status' => true,
                'id_product_brand' => $brand->id_product_brand
            ]);
        }

        return response()->json([
            'status' => false,
            'id_product_brand' => $existing->id_product_brand
        ]);
    }

    /**
     * Equivalent to data_sub_kategori()
     */
    public function dataSubKategori(Request $request)
    {
        $categoryId = $request->input('id_product_kategori');
        $subCategories = $this->productRepository->getSubCategories($categoryId);
        return response()->json($subCategories);
    }

    /**
     * Equivalent to ganti_status()
     */
    public function gantiStatus(Request $request, ChangeProductStatusAction $action)
    {
        // $this->authorize('changeStatus', Product::class);

        $request->validate([
            'id_product' => 'required|string',
            'status' => 'required|string',
        ]);

        $ids = explode('|', $request->input('id_product'));
        $status = $request->input('status');

        try {
            $action->execute($ids, $status);
            return response()->json([
                'success' => true,
                'message' => 'Status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download Brosur directly to bypass Windows php artisan serve symlink 403 bug
     */
    public function downloadBrosur($filename)
    {
        $path = storage_path('app/public/brosur/' . $filename);
        if (!file_exists($path)) {
            abort(404, 'File brosur tidak ditemukan di server.');
        }
        return response()->file($path);
    }
}
