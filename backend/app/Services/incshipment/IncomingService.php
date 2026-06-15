<?php

namespace App\Services\incshipment;

use App\Models\incshipment\IncomingHdr;
use App\Models\incshipment\IncomingDtl;
use Illuminate\Support\Facades\DB;
use Exception;

class IncomingService
{
    public function getDatatable($request)
    {
        $query = DB::table('tb_incoming_hdr as a')
            ->join('tb_po_hdr as b', 'a.id_po', '=', 'b.id_po')
            ->join('m_suppliers as c', 'a.id_suppliers', '=', 'c.id_suppliers')
            ->select(
                'a.id',
                'a.code',
                'c.nm_suppliers',
                'b.code_po',
                'a.date_create',
                'a.status_incoming',
                'a.f_assign_barcode'
            );

        if ($request->has('status') && $request->status !== 'ALL') {
            $query->where('a.status_incoming', $request->status);
        }

        return $query->orderBy('a.id', 'desc')->paginate($request->per_page ?? 10);
    }

    public function getById($id)
    {
        $header = DB::table('tb_incoming_hdr as a')
            ->join('tb_po_hdr as b', 'a.id_po', '=', 'b.id_po')
            ->join('m_suppliers as c', 'a.id_suppliers', '=', 'c.id_suppliers')
            ->join('m_gudang as d', 'b.id_gudang', '=', 'd.id_gudang')
            ->where('a.id', $id)
            ->select(
                'a.id',
                'a.code',
                'a.id_suppliers',
                'a.id_po',
                'c.nm_suppliers',
                'b.code_po',
                'a.date_receive',
                'a.date_create',
                'a.status_incoming',
                'a.f_assign_barcode',
                'a.f_print_barcode',
                'b.id_gudang',
                'd.nm_gudang',
                'a.f_ok_receive'
            )
            ->first();

        if (!$header) {
            throw new Exception("Incoming Shipment not found");
        }

        $details = DB::table('tb_incoming_dtl as a')
            ->join('m_product as b', 'a.id_product', '=', 'b.id_product')
            ->join('m_product_satuan as c', 'b.id_product_satuan', '=', 'c.id_product_satuan')
            ->leftJoin('m_product_lokasi as d', 'a.id_product_lokasi_source', '=', 'd.id_product_lokasi')
            ->leftJoin('m_product_lokasi as e', 'a.id_product_lokasi_destination', '=', 'e.id_product_lokasi')
            ->where('a.incoming_hdr_id', $id)
            ->select(
                'a.*',
                'b.code_product',
                'b.nm_product',
                'c.nm_product_satuan',
                'd.complete_name as lokasi_source',
                'e.complete_name as lokasi_destination'
            )
            ->get();

        $header->details = $details;
        return $header;
    }

    public function receiveIncoming($id, array $dataBarang = [])
    {
        DB::beginTransaction();
        try {
            $header = IncomingHdr::findOrFail($id);
            $id_gudang = DB::table('tb_po_hdr')->where('id_po', $header->id_po)->value('id_gudang');

            if (!empty($dataBarang)) {
                foreach ($dataBarang as $row) {
                    $id_dtl = $row['id_dtl'];
                    $detail = IncomingDtl::find($id_dtl);
                    if ($detail) {
                        $detail->update(['qty_terima' => 1]);

                        // insert_stock could be implemented here if required
                        // $this->insertStock($id_gudang, $detail->id_product, $detail->sn);
                    }
                }
            }

            // Check if there are unreceived details
            $unreceivedDetails = IncomingDtl::where('incoming_hdr_id', $id)
                ->where('qty_terima', 0)
                ->get();

            if ($unreceivedDetails->count() > 0) {
                // Generate new incoming shipment for the unreceived items
                $periode = date('Ym');
                $code_incoming = $this->generateRunningNumber('IN', $periode);

                $newHeader = IncomingHdr::create([
                    'code' => $code_incoming,
                    'id_po' => $header->id_po,
                    'id_suppliers' => $header->id_suppliers,
                    'status_incoming' => 'READY TO RECEIVE',
                    'date_create' => now(),
                    'f_assign_barcode' => $header->f_assign_barcode,
                    'f_print_barcode' => true,
                    'f_ok_receive' => true
                ]);

                foreach ($unreceivedDetails as $unreceived) {
                    IncomingDtl::create([
                        'incoming_hdr_id' => $newHeader->id,
                        'id_product' => $unreceived->id_product,
                        'qty' => 1,
                        'sn' => $unreceived->sn,
                        'status' => 'Available',
                        'qty_terima' => 0,
                        'id_product_lokasi_source' => $unreceived->id_product_lokasi_source,
                        'id_product_lokasi_destination' => $unreceived->id_product_lokasi_destination
                    ]);
                }

                // Delete the unreceived details from the current incoming shipment
                IncomingDtl::where('incoming_hdr_id', $id)->where('qty_terima', 0)->delete();
            }

            // Update current incoming shipment status
            $header->update([
                'status_incoming' => 'RECEIVED',
                'date_receive' => now(),
                'date_update' => now()
            ]);

            DB::commit();
            return $header;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function assignSn($id)
    {
        DB::beginTransaction();
        try {
            $header = IncomingHdr::findOrFail($id);
            $details = IncomingDtl::where('incoming_hdr_id', $id)->get();

            if ($details->count() > 0) {
                foreach ($details as $detail) {
                    if (empty($detail->sn)) {
                        $product = DB::table('m_product')->where('id_product', $detail->id_product)->first();
                        
                        if ($product) {
                            $id_kategori = $product->id_product_kategori;
                            $id_sub_kategori = $product->id_product_sub_kategori;
                            $tahun_mesin = date('y') + 3;
                            $no_urut = $this->generateRunningSn();

                            $sn_baru = "{$id_kategori}.{$id_sub_kategori}.{$detail->id_product}.{$tahun_mesin}.{$no_urut}";
                            $detail->update(['sn' => $sn_baru]);
                        }
                    }
                }
            }

            $header->update(['f_assign_barcode' => true]);

            DB::commit();
            return $header;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function printBarcode($id)
    {
        $header = IncomingHdr::findOrFail($id);
        $header->update([
            'f_print_barcode' => true,
            'f_ok_receive' => true
        ]);
        return $header;
    }

    private function generateRunningNumber($prefix, $periode)
    {
        $latest = DB::table('tb_incoming_hdr')
            ->where('code', 'like', "{$prefix}-{$periode}-%")
            ->orderBy('code', 'desc')
            ->first();

        if ($latest) {
            $parts = explode('-', $latest->code);
            $lastNumber = (int)end($parts);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        return "{$prefix}-{$periode}-{$newNumber}";
    }

    private function generateRunningSn()
    {
        // Dummy simple logic for SN running number (adjust if needed to read from DB)
        // Usually reads from a sequence table or gets max ID
        $count = DB::table('tb_incoming_dtl')->count();
        return str_pad($count + 1, 5, '0', STR_PAD_LEFT);
    }
}
