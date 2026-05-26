<?php

namespace App\Http\Controllers\API\cst;

use App\Http\Controllers\Controller;
use App\Services\cst\cstService;
use App\Http\Requests\cst\StoreCSTRequest;
use App\Http\Requests\cst\UpdateCSTRequest;
use App\Http\Resources\cst\cstResource;
use Illuminate\Http\Request;

class Cform extends Controller
{
    public function __construct(
        protected cstService $service
    ) {}

    /**
     * Get paginated list of CST tickets
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $all = $request->boolean('all');

        $data = $this->service->getAll($search, $startDate, $endDate, $all);

        return cstResource::collection($data);
    }

    /**
     * Get detailed ticket record with related worksheets (LKT)
     */
    public function show(string $cstCode)
    {
        $cstCode = str_replace('.', '/', $cstCode);
        $data = $this->service->getDetail($cstCode);

        if (!$data) {
            return response()->json(['message' => 'CST not found'], 404);
        }

        $lktList = $this->service->getLktList($cstCode);

        return (new cstResource($data))->additional([
            'lkt_list' => $lktList
        ]);
    }

    /**
     * Create new CST ticket manually
     */
    public function store(StoreCSTRequest $request)
    {
        $userId = $request->user() ? $request->user()->username : 'system';

        try {
            $cst = $this->service->createCst($request->validated(), $userId);

            return response()->json([
                'sukses' => true,
                'kode' => $cst->cst_code,
                'folder' => 'cst/cform/edit/' . str_replace('/', '.', $cst->cst_code) . '/f/'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'sukses' => false,
                'message' => 'Gagal menyimpan data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update existing CST ticket properties
     */
    public function update(UpdateCSTRequest $request, string $cstCode)
    {
        $cstCode = str_replace('.', '/', $cstCode);
        $userId = $request->user() ? $request->user()->username : 'system';

        try {
            $this->service->updateCst($cstCode, $request->validated(), $userId);

            return response()->json([
                'status' => true,
                'message' => 'Data berhasil diupdate'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal mengupdate data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Close the CST ticket
     */
    public function close(Request $request)
    {
        $request->validate([
            'cst_code' => 'required|string',
        ]);

        $cstCode = str_replace('.', '/', $request->input('cst_code'));
        $userId = $request->user() ? $request->user()->username : 'system';

        $result = $this->service->closeCst($cstCode, $userId);

        return response()->json($result);
    }

    /**
     * Cancel the CST ticket
     */
    public function cancel(Request $request)
    {
        $request->validate([
            'cst_code' => 'required|string',
        ]);

        $cstCode = str_replace('.', '/', $request->input('cst_code'));
        $userId = $request->user() ? $request->user()->username : 'system';

        $result = $this->service->cancelCst($cstCode, $userId);

        return response()->json($result);
    }
}
