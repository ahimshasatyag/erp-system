<?php

namespace App\Http\Controllers\API\productunit;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\productunit\StoreProductUnitRequest;
use App\Http\Requests\productunit\UpdateProductUnitRequest;
use App\Http\Resources\productunit\ProductUnitResource;
use App\Http\Resources\productunit\ProductUnitCollection;
use App\Repositories\productunit\ProductUnitRepositoryInterface;
use App\Services\productunit\ProductUnitService;
use App\Actions\productunit\DeleteProductUnitAction;

class ProductUnitController extends Controller
{
    protected $unitRepository;
    protected $unitService;

    public function __construct(
        ProductUnitRepositoryInterface $unitRepository,
        ProductUnitService $unitService
    ) {
        $this->unitRepository = $unitRepository;
        $this->unitService = $unitService;
    }

    public function index(Request $request)
    {
        $data = $this->unitRepository->getDatatable($request);
        return new ProductUnitCollection($data);
    }

    public function store(StoreProductUnitRequest $request)
    {
        $validatedData = $request->validated();

        try {
            $unit = $this->unitService->createUnit($validatedData);
            return response()->json([
                'success' => true,
                'data' => new ProductUnitResource($unit),
                'message' => 'Product Unit created successfully',
                'kode' => $unit->id_product_satuan
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
        $unit = $this->unitRepository->findById($id);
        if (!$unit) {
            return response()->json(['message' => 'Not found'], 404);
        }

        return new ProductUnitResource($unit);
    }

    public function update(UpdateProductUnitRequest $request, $id)
    {
        $validatedData = $request->validated();

        try {
            $unit = $this->unitService->updateUnit($id, $validatedData);
            return response()->json([
                'success' => true,
                'data' => new ProductUnitResource($unit),
                'message' => 'Product Unit updated successfully',
                'kode' => $unit->id_product_satuan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id, DeleteProductUnitAction $action)
    {
        try {
            $success = $action->execute($id);
            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Product Unit deleted successfully'
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
