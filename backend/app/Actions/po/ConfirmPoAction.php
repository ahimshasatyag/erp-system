<?php

namespace App\Actions\po;

use App\Models\po\PoHdr;
use App\Models\po\PoDtl;
use App\Models\po\IncomingHdr;
use App\Models\po\IncomingDtl;
use Illuminate\Support\Facades\DB;
use Exception;

class ConfirmPoAction
{
    public function execute($id_po)
    {
        DB::beginTransaction();
        try {
            $poHeader = PoHdr::findOrFail($id_po);

            if ($poHeader->status_po !== 'DRAFT PO') {
                throw new Exception("Hanya PO dengan status DRAFT PO yang dapat di-confirm.");
            }

            // Update status
            $poHeader->status_po = 'PO PURCHASE';
            $poHeader->save();

            // Generate Incoming Code
            $periode = date('Ym');
            $code_incoming = $this->generateIncomingNumber('IN', $periode);

            // Insert to Incoming Header
            $incomingHeader = IncomingHdr::create([
                'code' => $code_incoming,
                'id_po' => $id_po,
                'id_suppliers' => $poHeader->id_suppliers,
                'status_incoming' => 'Ready to Receive',
                'date_create' => now()
            ]);

            // Copy items to Incoming Detail
            $poDetails = PoDtl::where('id_po', $id_po)->get();
            foreach ($poDetails as $detail) {
                IncomingDtl::create([
                    'incoming_hdr_id' => $incomingHeader->id_incoming,
                    'id_product' => $detail->id_product,
                    'qty' => $detail->qty,
                    'status' => 'Available'
                ]);
            }

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function generateIncomingNumber($prefix, $periode)
    {
        $yearMonth = date('Ym', strtotime($periode . '01'));
        
        $latest = DB::table('tb_incoming_hdr')
            ->where('code', 'like', $prefix . $yearMonth . '%')
            ->orderBy('code', 'desc')
            ->first();

        if ($latest) {
            $lastNumber = (int)substr($latest->code, -4);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        return $prefix . $yearMonth . $newNumber;
    }
}
