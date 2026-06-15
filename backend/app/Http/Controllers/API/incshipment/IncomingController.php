<?php

namespace App\Http\Controllers\API\incshipment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\incshipment\IncomingService;
use App\Http\Requests\incshipment\ReceiveIncomingRequest;
use App\Http\Requests\incshipment\AssignSnRequest;
use App\Http\Resources\incshipment\IncomingResource;

class IncomingController extends Controller
{
    protected $service;

    public function __construct(IncomingService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        try {
            $data = $this->service->getDatatable($request);
            return response()->json([
                'success' => true,
                'data' => $data->items(),
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'last_page' => $data->lastPage(),
                    'per_page' => $data->perPage(),
                    'total' => $data->total()
                ]
            ]);
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
            $data = $this->service->getById($id);
            return new IncomingResource($data);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Incoming Shipment not found.'
            ], 404);
        }
    }

    public function receive(ReceiveIncomingRequest $request, $id)
    {
        try {
            $dataBarang = $request->input('data_barang', []);
            $data = $this->service->receiveIncoming($id, $dataBarang);
            return response()->json([
                'success' => true,
                'message' => 'Receive incoming berhasil',
                'data' => new IncomingResource($data)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function assignSn(AssignSnRequest $request, $id)
    {
        try {
            $data = $this->service->assignSn($id);
            return response()->json([
                'success' => true,
                'message' => 'Assign SN berhasil',
                'data' => new IncomingResource($data)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function printBarcode(Request $request, $id)
    {
        try {
            $data = $this->service->printBarcode($id);
            return response()->json([
                'success' => true,
                'message' => 'Print barcode status updated',
                'data' => new IncomingResource($data)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
