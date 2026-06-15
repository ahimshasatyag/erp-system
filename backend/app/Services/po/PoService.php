<?php

namespace App\Services\po;

use App\Models\po\PoHdr;
use App\Models\po\PoDtl;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Exception;

class PoService
{
    public function getDatatable($request)
    {
        $query = DB::table('tb_po_hdr')
            ->select('id_po', 'code_po', 'date_po', 'status_po');

        // Mengikuti logic CI lama: filter status
        $status = $request->input('status', 'PO PURCHASE');
        if ($status !== 'ALL') {
            $query->where('status_po', $status);
        }

        // Pagination/search logic can be added here
        return $query->orderBy('id_po', 'desc')->paginate($request->per_page ?? 10);
    }

    public function create(array $data, $file = null)
    {
        DB::beginTransaction();
        try {
            // Generate running number
            $periode = date("Ym", strtotime($data['date_po']));
            $code_po = $this->generateRunningNumber('PO', $periode);

            $headerData = [
                'code_po' => $code_po,
                'date_po' => $data['date_po'],
                'status_po' => 'DRAFT PO',
                'date_schdl' => $data['date_schdl'] ?? null,
                'id_suppliers' => $data['id_suppliers'],
                'partner_ref' => $data['partner_ref'] ?? null,
                'id_mata_uang' => $data['mata_uang'] ?? null,
                'id_gudang' => $data['id_gudang'],
                'id_product_lokasi' => $data['id_product_lokasi'] ?? null,
                'notes' => $data['notes'] ?? null,
                'date_create' => now()
            ];

            if ($file) {
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('assets/upload'), $filename);
                $headerData['link_file'] = $filename;
            }

            // Create Header
            $header = PoHdr::create($headerData);

            // Supplier name might need to be filled if needed, fetching from DB
            $supplier = DB::table('m_suppliers')->where('id_suppliers', $data['id_suppliers'])->first();
            if ($supplier) {
                $header->nm_suppliers = $supplier->nm_suppliers;
                if (empty($header->id_mata_uang)) {
                    $header->id_mata_uang = $supplier->id_mata_uang;
                }
                $header->save();
            }

            // Create Details
            foreach ($data['details'] as $detailData) {
                $qty = (float)str_replace(',', '', $detailData['qty'] ?? 0);
                if ($qty > 0) {
                    PoDtl::create([
                        'id_po' => $header->id_po,
                        'id_product' => $detailData['id_product'],
                        'code_product' => $detailData['code_product'] ?? '',
                        'nm_product' => $detailData['nm_product'] ?? '',
                        'product_deskripsi' => $detailData['product_deskripsi'] ?? '',
                        'qty' => $qty,
                        'product_price' => (float)str_replace(',', '', $detailData['product_price'] ?? 0),
                        'notes' => $detailData['notes'] ?? ''
                    ]);
                }
            }

            DB::commit();
            return $header;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getById($id)
    {
        $header = DB::table('tb_po_hdr as a')
            ->join('m_suppliers as b', 'a.id_suppliers', '=', 'b.id_suppliers')
            ->join('m_gudang as c', 'a.id_gudang', '=', 'c.id_gudang')
            ->leftJoin('m_mata_uang as d', 'a.id_mata_uang', '=', 'd.id_mata_uang')
            ->leftJoin('m_product_lokasi as e', 'a.id_product_lokasi', '=', 'e.id_product_lokasi')
            ->where('a.id_po', $id)
            ->select('a.*', 'b.nm_suppliers', 'c.nm_gudang', 'd.name as mata_uang', 'e.nm_product_lokasi')
            ->first();

        if (!$header) {
            throw new Exception("PO not found");
        }

        $details = DB::table('tb_po_dtl as a')
            ->join('m_product as b', 'a.id_product', '=', 'b.id_product')
            ->leftJoin('m_product_satuan as c', 'b.id_product_satuan', '=', 'c.id_product_satuan')
            ->where('a.id_po', $id)
            ->select('a.*', 'b.code_product', 'b.nm_product', 'b.product_deskripsi', 'c.nm_product_satuan')
            ->get();

        $header->details = $details;
        return $header;
    }

    public function update($id, array $data, $file = null)
    {
        DB::beginTransaction();
        try {
            $header = PoHdr::findOrFail($id);

            $headerData = [
                'date_po' => $data['date_po'],
                'date_schdl' => $data['date_schdl'] ?? null,
                'id_suppliers' => $data['id_suppliers'],
                'partner_ref' => $data['partner_ref'] ?? null,
                'id_mata_uang' => $data['mata_uang'] ?? null,
                'id_gudang' => $data['id_gudang'],
                'id_product_lokasi' => $data['id_product_lokasi'] ?? null,
                'notes' => $data['notes'] ?? null,
                'date_update' => now()
            ];

            if ($file) {
                if ($header->link_file && File::exists(public_path('assets/upload/' . $header->link_file))) {
                    File::delete(public_path('assets/upload/' . $header->link_file));
                }
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('assets/upload'), $filename);
                $headerData['link_file'] = $filename;
            }

            $header->update($headerData);

            // Update Details
            // Untuk mempermudah, kita hapus detail lama lalu insert baru.
            // Atau bisa update data per ID. Sesuai CI logic (simpan_po_dtl, check_qty_dtl), 
            // logic update di sana agak kompleks. Menghapus lalu insert kembali adalah yang paling aman dan bersih.
            PoDtl::where('id_po', $id)->delete();

            foreach ($data['details'] as $detailData) {
                $qty = (float)str_replace(',', '', $detailData['qty'] ?? 0);
                if ($qty > 0) {
                    PoDtl::create([
                        'id_po' => $header->id_po,
                        'id_product' => $detailData['id_product'],
                        'code_product' => $detailData['code_product'] ?? '',
                        'nm_product' => $detailData['nm_product'] ?? '',
                        'product_deskripsi' => $detailData['product_deskripsi'] ?? '',
                        'qty' => $qty,
                        'product_price' => (float)str_replace(',', '', $detailData['product_price'] ?? 0),
                        'notes' => $detailData['notes'] ?? ''
                    ]);
                }
            }

            DB::commit();
            return $header;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function generateRunningNumber($prefix, $periode)
    {
        // Simple logic for running number
        $yearMonth = date('Ym', strtotime($periode . '01')); // Ensure correct format
        
        $latest = DB::table('tb_po_hdr')
            ->where('code_po', 'like', $prefix . $yearMonth . '%')
            ->orderBy('code_po', 'desc')
            ->first();

        if ($latest) {
            $lastNumber = (int)substr($latest->code_po, -4);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        return $prefix . $yearMonth . $newNumber;
    }
}
