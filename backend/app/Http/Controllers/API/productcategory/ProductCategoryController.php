<?php

namespace App\Http\Controllers\API\productcategory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\productcategory\StoreProductCategoryRequest;
use App\Http\Requests\productcategory\UpdateProductCategoryRequest;
use App\Http\Resources\productcategory\ProductCategoryResource;
use App\Http\Resources\productcategory\ProductCategoryCollection;
use App\Repositories\productcategory\ProductCategoryRepositoryInterface;
use App\Services\productcategory\ProductCategoryService;
use App\Actions\productcategory\DeleteProductCategoryAction;

class ProductCategoryController extends Controller
{
    protected $categoryRepository;
    protected $categoryService;

    public function __construct(
        ProductCategoryRepositoryInterface $categoryRepository,
        ProductCategoryService $categoryService
    ) {
        $this->categoryRepository = $categoryRepository;
        $this->categoryService = $categoryService;
    }

    public function index(Request $request)
    {
        $data = $this->categoryRepository->getDatatable($request);
        return new ProductCategoryCollection($data);
    }

    public function store(StoreProductCategoryRequest $request)
    {
        $validatedData = $request->validated();

        try {
            $category = $this->categoryService->createCategory($validatedData);
            return response()->json([
                'success' => true,
                'data' => new ProductCategoryResource($category),
                'message' => 'Product Category created successfully',
                'kode' => $category->id_product_kategori
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
        $category = $this->categoryRepository->findById($id);
        if (!$category) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return new ProductCategoryResource($category);
    }

    public function update(UpdateProductCategoryRequest $request, $id)
    {
        $validatedData = $request->validated();

        try {
            $category = $this->categoryService->updateCategory($id, $validatedData);
            return response()->json([
                'success' => true,
                'data' => new ProductCategoryResource($category),
                'message' => 'Product Category updated successfully',
                'kode' => $category->id_product_kategori
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id, DeleteProductCategoryAction $action)
    {
        try {
            $success = $action->execute($id);
            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Product Category deleted successfully'
                ]);
            }
            return response()->json(['success' => false, 'message' => 'Failed to delete or not found'], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
