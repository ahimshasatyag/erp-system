<?php

namespace App\Http\Controllers\API\logbookcustomers;

use App\Http\Controllers\Controller;
use App\Services\logbookcustomers\LogBookCustomerService;
use App\Http\Requests\logbookcustomers\StoreLogBookCustomerRequest;
use App\Http\Requests\logbookcustomers\UpdateLogBookCustomerRequest;
use App\Http\Resources\logbookcustomers\LogBookCustomerResource;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class LogBookCustomerController extends Controller implements HasMiddleware
{
    public function __construct(
        protected LogBookCustomerService $service
    ) {}

    public static function middleware(): array
    {
        return [
            new Middleware('can:viewAny,App\Models\logbookcustomers\LogBookCustomer', only: ['index', 'formData']),
            new Middleware('can:view,App\Models\logbookcustomers\LogBookCustomer', only: ['show']),
            new Middleware('can:create,App\Models\logbookcustomers\LogBookCustomer', only: ['store']),
            new Middleware('can:update,App\Models\logbookcustomers\LogBookCustomer', only: ['update']),
            new Middleware('can:delete,App\Models\logbookcustomers\LogBookCustomer', only: ['destroy']),
        ];
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $all = $request->boolean('all');

        $data = $this->service->getAll($search, $startDate, $endDate, $all);

        return LogBookCustomerResource::collection($data);
    }

    public function show(string $idLogBook)
    {
        $data = $this->service->getDetail($idLogBook);

        if (!$data) {
            return response()->json(['message' => 'Log Book Customer not found'], 404);
        }

        return new LogBookCustomerResource($data);
    }

    public function store(StoreLogBookCustomerRequest $request)
    {
        $username = $request->user() ? $request->user()->username : 'system';
        
        try {
            $logBook = $this->service->createLogBook($request->validated(), $username);

            return response()->json([
                'sukses' => true,
                'kode' => $logBook->id_log_book,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'sukses' => false,
                'message' => 'Gagal menyimpan data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateLogBookCustomerRequest $request, string $idLogBook)
    {
        try {
            $this->service->updateLogBook($idLogBook, $request->validated());

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

    public function destroy(string $idLogBook)
    {
        try {
            $this->service->deleteLogBook($idLogBook);

            return response()->json([
                'status' => true,
                'message' => 'Data berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Gagal menghapus data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function formData()
    {
        $customers = $this->service->getCustomersList();

        return response()->json([
            'customers' => $customers
        ]);
    }
}
