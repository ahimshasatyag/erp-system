<?php

namespace App\Http\Controllers\API\csr;

use App\Http\Controllers\Controller;
use App\Services\csr\csrService;
use App\Http\Requests\csr\StoreCSRRequest;
use App\Http\Requests\csr\UpdateCSRRequest;
use App\Http\Resources\csr\csrResouce;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class Cform extends Controller implements HasMiddleware
{
    public function __construct(
        protected csrService $service
    ) {}

    public static function middleware(): array
    {
        return [
            new Middleware('can:viewAny,App\Models\csr\Mmaster', only: ['index']),
            new Middleware('can:view,App\Models\csr\Mmaster', only: ['show']),
            new Middleware('can:create,App\Models\csr\Mmaster', only: ['store', 'addNewCst']),
            new Middleware('can:update,App\Models\csr\Mmaster', only: ['update', 'confirm', 'cancel']),
        ];
    }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $all = $request->boolean('all');

        $data = $this->service->getAll($search, $startDate, $endDate, $all);

        return csrResouce::collection($data);
    }

    public function show(string $csrCode)
    {
        $csrCode = str_replace('.', '/', $csrCode);
        $data = $this->service->getDetail($csrCode);

        if (!$data) {
            return response()->json(['message' => 'CSR not found'], 404);
        }

        return new csrResouce($data);
    }

    public function store(StoreCSRRequest $request)
    {
        $userId = $request->user() ? $request->user()->username : 'system';
        
        try {
            $csr = $this->service->createCsr(
                $request->validated(), 
                $request->file('link_foto'), 
                $userId
            );

            return response()->json([
                'sukses' => true,
                'kode' => $csr->csr_code,
                'folder' => 'afs/cform/edit/' . str_replace('/', '.', $csr->csr_code) . '/f/'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'sukses' => false,
                'message' => 'Gagal menyimpan data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateCSRRequest $request, string $csrCode)
    {
        $csrCode = str_replace('.', '/', $csrCode);
        $userId = $request->user() ? $request->user()->username : 'system';

        // Check if already approved
        $csr = $this->service->getDetail($csrCode);
        if ($csr && $csr->approved_csr_by != null) {
            return response()->json([
                'status' => false,
                'message' => 'CSR sudah dikonfirmasi, tidak bisa diedit'
            ]);
        }

        try {
            $this->service->updateCsr(
                $csrCode, 
                $request->validated(), 
                $request->file('link_foto'), 
                $userId
            );

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

    public function confirm(Request $request)
    {
        $request->validate([
            'csr_code' => 'required|string',
            'customer' => 'required|string',
            'product' => 'required|string',
        ]);

        $userId = $request->user() ? $request->user()->username : 'system';

        $result = $this->service->confirmCsr(
            $request->input('csr_code'),
            $request->input('customer'),
            $request->input('product'),
            $userId
        );

        return response()->json($result);
    }

    public function cancel(Request $request)
    {
        $request->validate([
            'csr_code' => 'required|string',
            'customer' => 'required|string',
            'product' => 'required|string',
            'memo' => 'required|string',
        ]);

        $userId = $request->user() ? $request->user()->username : 'system';

        $result = $this->service->cancelCsr(
            $request->input('csr_code'),
            $request->input('customer'),
            $request->input('product'),
            $request->input('memo'),
            $userId
        );

        return response()->json($result);
    }

    public function isiOtomatis(Request $request)
    {
        $request->validate([
            'barcode' => 'required|string'
        ]);

        $data = $this->service->getBarcodeData($request->input('barcode'));

        return response()->json([
            'so_code' => $data->code_so ?? null,
            'tgl_delivered' => $data->date_delivery ?? null,
            'do_code' => $data->code_do ?? null,
            'id_product' => $data->id_product ?? null,
            'status' => $data->status_do ?? null,
            'customers' => $data->id_customers ?? null,
            'mesin_lama' => $data->mesin_lama ?? null,
            'provinsi' => $data->provinsi ?? null,
        ]);
    }

    public function formData()
    {
        $products = \Illuminate\Support\Facades\DB::table('m_product')->select('id_product', 'code_product', 'nm_product')->get();
        $customers = \Illuminate\Support\Facades\DB::table('m_customers')->select('id_customers', 'nm_customers', 'customers_address', 'provinsi')->get();
        $karyawan = \Illuminate\Support\Facades\DB::table('m_karyawan')
            ->leftJoin('m_karyawan_divisi', 'm_karyawan.id_karyawan_divisi', '=', 'm_karyawan_divisi.id_karyawan_divisi')
            ->where('m_karyawan_divisi.nm_karyawan_divisi', 'Services')
            ->select('m_karyawan.id_karyawan', 'm_karyawan.nm_karyawan', 'm_karyawan_divisi.nm_karyawan_divisi as divisi')
            ->get();

        return response()->json([
            'products' => $products,
            'customers' => $customers,
            'karyawan' => $karyawan
        ]);
    }

    public function addNewCst(Request $request)
    {
        $request->validate([
            'csr_code' => 'required|string'
        ]);

        $csrCode = $request->input('csr_code');
        $csr = \Illuminate\Support\Facades\DB::table('tb_afs_csr')->where('csr_code', $csrCode)->first();

        if (!$csr) {
            return response()->json(['status' => false, 'message' => 'CSR tidak ditemukan'], 404);
        }

        $cstCode = \App\Helpers\CsrHelper::generateCstCode();

        \Illuminate\Support\Facades\DB::table('tb_afs_cst')->insert([
            'id_afs_csr' => $csr->id_afs_csr,
            'cst_code' => $cstCode,
            'cst_date' => now(),
            'status' => 'OUTSTANDING'
        ]);

        return response()->json([
            'status' => true,
            'cst_code' => str_replace('/', '.', $cstCode)
        ]);
    }
}
