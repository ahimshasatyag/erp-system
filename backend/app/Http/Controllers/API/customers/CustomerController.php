<?php

namespace App\Http\Controllers\API\customers;

use App\Http\Controllers\Controller;
use App\Http\Requests\customers\StoreCustomerRequest;
use App\Http\Requests\customers\UpdateCustomerRequest;
use App\Http\Resources\customers\CustomerCollection;
use App\Http\Resources\customers\CustomerResource;
use App\Repositories\customers\CustomerRepositoryInterface;
use App\Services\customers\CustomerService;
use App\Actions\customers\DeleteCustomerAction;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    protected $repository;
    protected $service;

    public function __construct(CustomerRepositoryInterface $repository, CustomerService $service)
    {
        $this->repository = $repository;
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $customers = $this->repository->getDatatable($request);
        return new CustomerCollection($customers);
    }

    public function store(StoreCustomerRequest $request)
    {
        $customer = $this->service->create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Customer berhasil ditambahkan',
            'data' => new CustomerResource($customer)
        ], 201);
    }

    public function show($id)
    {
        $customer = $this->repository->findById($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new CustomerResource($customer)
        ]);
    }

    public function update(UpdateCustomerRequest $request, $id)
    {
        $customer = $this->service->update($id, $request->validated());

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer tidak ditemukan atau gagal diupdate'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Customer berhasil diupdate',
            'data' => new CustomerResource($customer)
        ]);
    }

    public function destroy($id, DeleteCustomerAction $deleteAction)
    {
        $deleted = $deleteAction->execute($id);

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Customer tidak ditemukan atau gagal dihapus'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Customer berhasil dihapus'
        ]);
    }

    public function getProvinsi()
    {
        $data = $this->repository->getProvinces();
        return response()->json($data);
    }

    public function getKabupaten(Request $request)
    {
        $kode_provinsi = $request->input('kode_provinsi');
        $data = $this->repository->getKabupatenByProvinsi($kode_provinsi);
        return response()->json($data);
    }
}
