<?php

namespace App\Http\Controllers\API\cekserialnumber;

use App\Http\Controllers\Controller;
use App\Http\Requests\cekserialnumber\CheckSerialRequest;
use App\Services\cekserialnumber\CekSerialNumberService;
use App\Http\Resources\cekserialnumber\CekSerialNumberResource;
use App\Http\Resources\cekserialnumber\CekSerialNumberDetailResource;
use Illuminate\Http\JsonResponse;

class Cform extends Controller
{
    public function __construct(
        protected CekSerialNumberService $cekSerialNumberService
    ) {}

    /**
     * Get list of serial numbers (paginated).
     */
    public function index(CheckSerialRequest $request)
    {
        $search = $request->input('search');
        $paginator = $this->cekSerialNumberService->getList($search);
        
        return CekSerialNumberResource::collection($paginator);
    }

    /**
     * Get detail and history of a specific serial number.
     */
    public function detail_serial(string $barcode, CheckSerialRequest $request): JsonResponse
    {
        $data = $this->cekSerialNumberService->getDetail($barcode);

        if ($data['detail']->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'Serial Number not found.'
            ], 404);
        }

        return response()->json(new CekSerialNumberDetailResource($data));
    }
}
