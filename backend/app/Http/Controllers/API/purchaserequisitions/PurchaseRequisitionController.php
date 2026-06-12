<?php

namespace App\Http\Controllers\API\purchaserequisitions;

use App\Http\Controllers\Controller;
use App\Http\Requests\purchaserequisitions\StorePurchaseRequisitionRequest;
use App\Http\Requests\purchaserequisitions\UpdatePurchaseRequisitionRequest;
use App\Http\Requests\purchaserequisitions\GeneratePoRequest;
use App\Http\Resources\purchaserequisitions\PurchaseRequisitionCollection;
use App\Http\Resources\purchaserequisitions\PurchaseRequisitionResource;
use App\Repositories\purchaserequisitions\PurchaseRequisitionRepositoryInterface;
use App\Services\purchaserequisitions\PurchaseRequisitionService;
use App\Actions\purchaserequisitions\SubmitPurchaseRequisitionAction;
use App\Actions\purchaserequisitions\GeneratePoFromPrAction;
use Illuminate\Http\Request;

class PurchaseRequisitionController extends Controller
{
    protected $repository;
    protected $service;

    public function __construct(PurchaseRequisitionRepositoryInterface $repository, PurchaseRequisitionService $service)
    {
        $this->repository = $repository;
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $prs = $this->repository->getDatatable($request);
        return new PurchaseRequisitionCollection($prs);
    }

    public function store(StorePurchaseRequisitionRequest $request)
    {
        $pr = $this->service->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Purchase Requisition berhasil ditambahkan',
            'kode' => $pr->code_pr,
            'data' => new PurchaseRequisitionResource($pr)
        ], 201);
    }

    public function show($id)
    {
        $pr = $this->repository->findById($id);

        if (!$pr) {
            return response()->json([
                'success' => false,
                'message' => 'Purchase Requisition tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new PurchaseRequisitionResource($pr),
            'data_product' => $this->repository->getProducts(),
            'data_gudang' => $this->repository->getGudangs(),
            'data_users' => $this->repository->getUsers()
        ]);
    }

    public function update(UpdatePurchaseRequisitionRequest $request, $id)
    {
        $pr = $this->service->update($id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Purchase Requisition berhasil diupdate',
            'kode' => $pr->code_pr,
            'data' => new PurchaseRequisitionResource($pr)
        ]);
    }

    public function detailBarang(Request $request)
    {
        $idProduct = $request->input('id_product');
        $data = $this->repository->getProductDetail($idProduct);

        return response()->json([
            'data' => $data ? [$data] : []
        ]);
    }

    public function ajukan($id, SubmitPurchaseRequisitionAction $submitAction)
    {
        $pr = $submitAction->execute($id);

        if (!$pr) {
            return response()->json([
                'success' => false,
                'message' => 'Purchase Requisition tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'kode' => 'Status : PR',
            'message' => 'Purchase Requisition berhasil diajukan'
        ]);
    }

    public function listPr(Request $request)
    {
        $prs = $this->repository->getPrDatatable($request);
        return response()->json($prs);
    }

    public function simpanPo(GeneratePoRequest $request, GeneratePoFromPrAction $generatePoAction)
    {
        $result = $generatePoAction->execute($request->input('data_id_pr_dtl'));

        return response()->json($result);
    }
}
