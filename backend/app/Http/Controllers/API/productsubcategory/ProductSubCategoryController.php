<?php

namespace App\Http\Controllers\API\productsubcategory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\productsubcategory\ProductSubCategoryRequest;
use App\Http\Resources\productsubcategory\ProductSubCategoryResource;
use App\Repositories\productsubcategory\ProductSubCategoryRepositoryInterface;
use App\Actions\productsubcategory\CreateProductSubCategoryAction;
use App\Actions\productsubcategory\UpdateProductSubCategoryAction;
use App\Actions\productsubcategory\DeleteProductSubCategoryAction;

class ProductSubCategoryController extends Controller
{
    protected $repository;

    public function __construct(ProductSubCategoryRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function index(Request $request)
    {
        $categories = $this->repository->getDatatable($request);
        return ProductSubCategoryResource::collection($categories);
    }

    public function store(ProductSubCategoryRequest $request, CreateProductSubCategoryAction $action)
    {
        $category = $action->execute($request->validated());
        return new ProductSubCategoryResource($category);
    }

    public function show($id)
    {
        $category = $this->repository->findById($id);
        if (!$category) {
            return response()->json(['message' => 'Product Sub Category not found'], 404);
        }
        // Load relationship for the resource
        $category->load('category');
        return new ProductSubCategoryResource($category);
    }

    public function update(ProductSubCategoryRequest $request, $id, UpdateProductSubCategoryAction $action)
    {
        $category = $action->execute($id, $request->validated());
        return new ProductSubCategoryResource($category);
    }

    public function destroy($id, DeleteProductSubCategoryAction $action)
    {
        $success = $action->execute($id);
        if ($success) {
            return response()->json(['message' => 'Product Sub Category deleted successfully']);
        }
        return response()->json(['message' => 'Product Sub Category not found or deletion failed'], 404);
    }
}
