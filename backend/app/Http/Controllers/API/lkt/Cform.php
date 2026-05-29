<?php

namespace App\Http\Controllers\API\lkt;

use App\Http\Controllers\Controller;
use App\Http\Requests\lkt\StoreLKTRequest;
use App\Http\Requests\lkt\UpdateLKTRequest;
use App\Http\Resources\lkt\lktResource;
use App\Models\lkt\Mmaster;
use App\Repositories\lkt\lktRepository;
use App\Actions\lkt\CreateLKTAction;
use App\Actions\lkt\UpdateLKTAction;
use App\Services\lkt\lktService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Exception;

class Cform extends Controller
{
    protected lktRepository $repository;
    protected lktService $service;

    public function __construct(lktRepository $repository, lktService $service)
    {
        $this->repository = $repository;
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        if (Gate::denies('viewAny', Mmaster::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $search = $request->query('search');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $all = $request->boolean('all');
        $status = $request->query('status');

        $paginator = $this->repository->getAll($search, $startDate, $endDate, $all, $status);

        return response()->json([
            'status' => 'success',
            'data' => lktResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLKTRequest $request, CreateLKTAction $action): JsonResponse
    {
        if (Gate::denies('create', Mmaster::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $imageFile = $request->file('link_foto');
            $lkt = $action->execute($request->validated(), $imageFile);

            return response()->json([
                'status' => 'success',
                'message' => 'Data LKT Berhasil Disimpan',
                'data' => new lktResource($lkt)
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $lktCode): JsonResponse
    {
        if (Gate::denies('view', Mmaster::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Format code from URL dot format back to slash format
        $formattedCode = str_replace('.', '/', $lktCode);

        $lkt = $this->repository->getByCode($formattedCode);
        if (!$lkt) {
            return response()->json(['message' => 'Data LKT tidak ditemukan.'], 404);
        }

        // Fetch related details
        $visits = $this->repository->getVisitList($formattedCode);
        $plannedParts = $this->repository->getPartDetail($formattedCode);
        $plannedTechs = $this->repository->getTechnicians($formattedCode);

        return response()->json([
            'status' => 'success',
            'data' => new lktResource($lkt),
            'visits' => $visits,
            'parts' => $plannedParts,
            'technicians' => $plannedTechs,
            'all_cancelled' => $this->repository->allVisitsCancelled($formattedCode),
            'any_closed' => $this->repository->anyVisitClosed($formattedCode),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(string $lktCode, UpdateLKTRequest $request, UpdateLKTAction $action): JsonResponse
    {
        if (Gate::denies('update', Mmaster::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $formattedCode = str_replace('.', '/', $lktCode);

        try {
            $imageFile = $request->file('link_foto');
            $action->execute($formattedCode, $request->validated(), $imageFile);

            return response()->json([
                'status' => 'success',
                'message' => 'Data LKT Berhasil Diubah'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Confirm LKT sheet, setting LKT and CST to ON PROGRESS state.
     */
    public function confirm(Request $request): JsonResponse
    {
        if (Gate::denies('update', Mmaster::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'lkt_code' => 'required|string',
            'cst_code' => 'required|string',
        ]);

        try {
            $this->service->confirm($request->input('lkt_code'), $request->input('cst_code'));
            return response()->json([
                'status' => 'success',
                'message' => 'LKT Berhasil Dikonfirmasi (ON PROGRESS)'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Close LKT worksheet, marking it DONE.
     */
    public function close(Request $request): JsonResponse
    {
        if (Gate::denies('update', Mmaster::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'lkt_code' => 'required|string',
        ]);

        try {
            $this->service->close($request->input('lkt_code'));
            return response()->json([
                'status' => 'success',
                'message' => 'LKT Berhasil Diselesaikan (DONE)'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Save a technician visit log (realisasi).
     */
    public function saveVisit(Request $request): JsonResponse
    {
        if (Gate::denies('update', Mmaster::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'lkt_code'             => 'required|string',
            'cst_code'             => 'required|string',
            'actual_starting_date' => 'required|date',
            'actual_day'           => 'required|integer',
            'actual_service_amount' => 'nullable|string',
            'actual_transport_amount' => 'nullable|string',
            'actual_accommodation_amount' => 'nullable|string',
            'actual_description'   => 'required|string',
            'nm_teknisi'           => 'required|array',
            'link_foto'            => 'nullable|image|mimes:jpeg,png,jpg,bmp|max:5120',
        ]);

        try {
            $imageFile = $request->file('link_foto');
            $visitId = $this->service->saveVisit($request->all(), $imageFile);

            return response()->json([
                'status' => 'success',
                'message' => 'Realisasi Visit Berhasil Disimpan',
                'id_ak' => $visitId
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Save planned spare part item.
     */
    public function savePart(Request $request): JsonResponse
    {
        if (Gate::denies('update', Mmaster::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'lkt_code'      => 'required|string',
            'add_part_name' => 'required|string',
            'add_qty_part'  => 'required|string',
            'add_harga_es'  => 'required|string',
        ]);

        try {
            $this->service->savePart($request->all());
            return response()->json([
                'status' => 'success',
                'message' => 'Part Estimasi Berhasil Disimpan'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Save actual spare part item used in visit.
     */
    public function savePartVisit(Request $request): JsonResponse
    {
        if (Gate::denies('update', Mmaster::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'lkt_code'      => 'required|string',
            'id_visit'      => 'required|string',
            'add_part_name' => 'required|string',
            'add_qty_part'  => 'required|string',
            'add_harga_es'  => 'required|string',
        ]);

        try {
            $this->service->savePartVisit($request->all());
            return response()->json([
                'status' => 'success',
                'message' => 'Part Realisasi Berhasil Disimpan'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Cancel an LKT worksheet
     */
    public function cancel(Request $request): JsonResponse
    {
        if (Gate::denies('update', Mmaster::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'lkt_code' => 'required|string',
        ]);

        try {
            $this->service->cancel($request->input('lkt_code'));
            return response()->json([
                'status' => 'success',
                'message' => 'Data LKT Berhasil di-Cancel'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Get details of a single technician visit
     */
    public function getVisit(string $subCode): JsonResponse
    {
        if (Gate::denies('view', Mmaster::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $visit = $this->repository->getVisitDetail($subCode);
        if (!$visit) {
            return response()->json(['message' => 'Data Visit tidak ditemukan.'], 404);
        }

        $parts = $this->repository->getPartDetailSub($subCode);
        $techs = $this->repository->getVisitTechnicians($subCode);

        return response()->json([
            'status' => 'success',
            'data' => $visit,
            'parts' => $parts,
            'technicians' => $techs,
        ]);
    }

    /**
     * Update visit realisasi details
     */
    public function updateVisit(string $subCode, Request $request): JsonResponse
    {
        if (Gate::denies('update', Mmaster::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'lkt_code'             => 'required|string',
            'cst_code'             => 'required|string',
            'actual_starting_date' => 'required|date',
            'actual_day'           => 'required|integer',
            'actual_service_amount' => 'nullable|string',
            'actual_transport_amount' => 'nullable|string',
            'actual_accommodation_amount' => 'nullable|string',
            'actual_description'   => 'required|string',
            'nm_teknisi'           => 'required|array',
            'link_foto'            => 'nullable|image|mimes:jpeg,png,jpg,bmp|max:5120',
        ]);

        try {
            $imageFile = $request->file('link_foto');
            $this->service->updateVisit($subCode, $request->all(), $imageFile);

            return response()->json([
                'status' => 'success',
                'message' => 'Realisasi Visit Berhasil Diubah'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Cancel a visit realisasi
     */
    public function cancelVisit(Request $request): JsonResponse
    {
        if (Gate::denies('update', Mmaster::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'lkt_sub_code' => 'required|string',
        ]);

        try {
            $this->service->cancelVisit($request->input('lkt_sub_code'));
            return response()->json([
                'status' => 'success',
                'message' => 'Data Realisasi berhasil di-Cancel'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 422);
        }
    }
}
