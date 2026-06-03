<?php

namespace App\Actions\cekserialnumber;

use Illuminate\Support\Facades\DB;

class GetHistorySerialNumberAction
{
    public function execute(string $barcode)
    {
        $history = DB::table('tb_afs_csr as a')
            ->join('tb_afs_cst as b', 'a.id_afs_csr', '=', 'b.id_afs_csr')
            ->join('tb_afs_lkt as c', 'b.id_afs_cst', '=', 'c.id_afs_cst')
            ->select(
                'b.cst_code',
                'b.cst_date',
                'b.status',
                'c.description as catatan_kerusakan',
                'c.lkt_code',
                'c.id_afs_lkt'
            )
            ->where('a.barcode', $barcode)
            ->orderBy('b.cst_date', 'desc')
            ->get();

        foreach ($history as $row) {
            // Calculate total_realisasi
            $row->total_realisasi = DB::table('tb_afs_realisasi')
                ->where('id_afs_lkt', $row->id_afs_lkt)
                ->count('lkt_sub_code');

            // Get laporan_akhir
            $laporan = DB::table('tb_afs_realisasi')
                ->where('id_afs_lkt', $row->id_afs_lkt)
                ->orderBy('actual_starting_date', 'desc')
                ->orderBy('lkt_sub_code', 'desc')
                ->value('lap_penyelesain');
            $row->laporan_akhir = $laporan;

            // Get teknisi names
            $query1 = DB::table('tb_afs_realisasi_teknisi as rt')
                ->leftJoin('m_karyawan as mk', 'mk.id_karyawan', '=', 'rt.id_karyawan')
                ->select('mk.nm_karyawan')
                ->where('rt.id_afs_lkt', $row->id_afs_lkt)
                ->whereNotNull('rt.id_karyawan')
                ->where('rt.id_karyawan', '>', 0);

            $query2 = DB::table('tb_afs_realisasi_teknisi as rt')
                ->leftJoin('tb_afs_realisasi as r', 'r.lkt_sub_code', '=', 'rt.lkt_sub_code')
                ->leftJoin('m_karyawan as mk', 'mk.id_karyawan', '=', 'rt.actual_id_karyawan')
                ->select('mk.nm_karyawan')
                ->where('rt.id_afs_lkt', $row->id_afs_lkt)
                ->where(function($q) {
                    $q->whereNull('rt.id_karyawan')->orWhere('rt.id_karyawan', 0);
                });

            $teknisi = $query1->union($query2)->get();
            
            $teknisi_names = [];
            foreach ($teknisi as $t) {
                if ($t->nm_karyawan) {
                    $teknisi_names[] = $t->nm_karyawan;
                }
            }
            $row->teknisi = implode(", ", array_unique($teknisi_names));
        }

        return $history;
    }
}
