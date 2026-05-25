<?php

defined('BASEPATH') or exit('No direct script access allowed');

use Ozdemir\Datatables\Datatables;
use Ozdemir\Datatables\DB\CodeigniterAdapter;

class Mmaster extends CI_Model
{
    public function data($i_menu, $folder, $start_date, $end_date)
    {
        $datatables = new Datatables(new CodeigniterAdapter);
        $datatables->query("SELECT a.*, m_karyawan.nm_karyawan, m_customers.nm_customers, m_product.nm_product, m_product.code_product, '$folder' AS folder
            FROM tb_afs_csr a
            JOIN m_karyawan ON a.id_karyawan = m_karyawan.id_karyawan 
            JOIN m_customers ON a.id_customers = m_customers.id_customers 
            JOIN m_product ON a.id_product = m_product.id_product 
            WHERE a.csr_status NOT IN ('IN PROGRESS')
            AND a.csr_date >= '$start_date'
            AND a.csr_date <= '$end_date'
            ORDER BY a.csr_code ASC");

        $datatables->hide('folder');
        $datatables->hide('csr_code');
        $no = 1;

        $datatables->edit('csr_code', function ($data) use ($folder) {
            $csr_code = $data['csr_code'];
            $folder = $data['folder'];

            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$csr_code/f\",\"#main\"); return false;'>$csr_code</a>";
            return $hasil;
        });

        $datatables->edit('csr_date', function ($data) use ($folder) {
            $csr_code = $data['csr_code'];
            $folder = $data['folder'];
            $date_csr = date("d-m-Y", strtotime($data['csr_date']));

            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$csr_code/f\",\"#main\"); return false;'>$date_csr</a>";
            return $hasil;
        });

        $datatables->edit('nm_customers', function ($data) use ($folder) {
            $csr_code = $data['csr_code'];
            $folder = $data['folder'];
            $nm_customers = $data['nm_customers'];

            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$csr_code/f\",\"#main\"); return false;'>$nm_customers</a>";
            return $hasil;
        });

        $datatables->edit('nm_karyawan', function ($data) use ($folder) {
            $csr_code = $data['csr_code'];
            $folder = $data['folder'];
            $nm_karyawan = $data['nm_karyawan'];

            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$csr_code/f\",\"#main\"); return false;'>$nm_karyawan</a>";
            return $hasil;
        });

        $datatables->edit('status', function ($data) use ($folder) {
            $csr_code = $data['csr_code'];
            $folder = $data['folder'];
            $status = $data['csr_status'];

            $badge = '';
            switch ($status) {
                case 'DRAFT':
                    $badge = 'warning';
                    break;
                case 'OUTSTANDING':
                    $badge = 'dark';
                    break;
                case 'CANCEL':
                    $badge = 'info';
                    break;
                default:
                    $badge = 'primary';
            }
            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$csr_code/f\",\"#main\"); return false;'><span class=\"badge badge-$badge\">$status</span></a>";
            return $hasil;
        });

        return $datatables->generate();
    }

    public function bacasemua($search, $start_date, $end_date, $all)
    {
        $this->db->select('tb_afs_csr.*, m_karyawan.nm_karyawan, m_customers.nm_customers, m_product.nm_product, m_product.code_product');
        $this->db->from('tb_afs_csr');
        $this->db->join('m_karyawan', 'tb_afs_csr.id_karyawan = m_karyawan.id_karyawan');
        $this->db->join('m_customers', 'tb_afs_csr.id_customers = m_customers.id_customers');
        $this->db->join('m_product', 'tb_afs_csr.id_product = m_product.id_product');
        $this->db->where_not_in('tb_afs_csr.csr_status', ['IN PROGRESS']);

        if (empty($start_date)) {
            $start_date = date('Y-m-01');
        }

        if (empty($end_date)) {
            $end_date = date('Y-m-d');
        }

        $all = empty($all) ? false : true;

        if (!$all) {
            $this->db->where('tb_afs_csr.csr_date >=', $start_date);
            $this->db->where('tb_afs_csr.csr_date <=', $end_date);
        }

        if ($search) {
            $array_like = explode(',', $search);

            if ($array_like) {
                $this->db->group_start();

                foreach ($array_like as $key => $value) {
                    if ($key == 0) {
                        $this->db->like('csr_code', $value);
                        $this->db->like('nm_customers', $value);
                        $this->db->like('code_product', $value);
                        $this->db->like('nm_karyawan', $value);
                        $this->db->like('csr_status', $value);
                    } else {
                        $this->db->or_like('csr_code', $value);
                        $this->db->or_like('nm_customers', $value);
                        $this->db->or_like('code_product', $value);
                        $this->db->or_like('nm_karyawan', $value);
                        $this->db->or_like('csr_status', $value);
                    }
                }
                $this->db->group_end();
            }
        }

        $this->db->order_by('tb_afs_csr.csr_code', 'ASC');

        $count = $this->db->count_all_results('', false);
        $count = intval($count);


        // $this->db->limit($limit, $start);

        $query = $this->db->get();

        return array(
            'data' => $query,
            'total' => $count,
        );
    }

    public function bacadetail($csr_code)
    {

        $this->db->select('tb_afs_csr.*, m_karyawan.nm_karyawan, m_customers.nm_customers, m_customers.customers_mobile, tb_so_hdr.customers_address, m_product.nm_product, m_product.code_product, m_product.id_product_kategori, tb_so_hdr.keterangan, tb_so_hdr.internal_notes, m_product_kategori.nm_product_kategori');
        $this->db->from('tb_afs_csr');
        $this->db->join('m_karyawan', 'tb_afs_csr.id_karyawan = m_karyawan.id_karyawan', 'left');
        $this->db->join('m_customers', 'tb_afs_csr.id_customers = m_customers.id_customers', 'left');
        $this->db->join('m_product', 'tb_afs_csr.id_product = m_product.id_product', 'left');
        $this->db->join('tb_do_hdr', 'tb_afs_csr.do_code = tb_do_hdr.code_do', 'left');
        $this->db->join('m_product_kategori', 'm_product.id_product_kategori = m_product_kategori.id_product_kategori', 'left');
        $this->db->join('tb_so_hdr', 'tb_do_hdr.id_so = tb_so_hdr.id_so', 'left');
        $this->db->where('tb_afs_csr.csr_code', $csr_code);

        $this->db->order_by('csr_code', 'ASC');

        $count = $this->db->count_all_results('', false);
        $count = intval($count);

        $query = $this->db->get();

        return array(
            'data' => $query,
            'total' => $count,
        );
    }

    public function bacadetail_cst($csr_code)
    {
        $this->db->select('
            a.id_afs_cst,
            a.cst_code,
            a.cst_date,
            a.status,
            a.approved_cst_by,
            b.csr_code,
            b.approved_csr_by,
            d.nm_product,
            d.code_product,
            e.nm_karyawan
        ');
        $this->db->from('tb_afs_cst a');
        $this->db->join('tb_afs_csr b', 'a.id_afs_csr = b.id_afs_csr');
        $this->db->join('m_karyawan e', 'b.id_karyawan = e.id_karyawan');
        $this->db->join('m_product d', 'b.id_product = d.id_product');
        $this->db->where('b.csr_code', $csr_code);
        $this->db->where('a.cst_code <>', 'kosong');
        $this->db->order_by('a.cst_code', 'DESC');

        return $this->db->get();
    }

    public function bacabarcode($barcode)
    {
        $this->db->select("c.code_so, a.nbarcode, b.date_delivery, b.code_do, a.id_product, b.status_do, b.id_customers, '' as mesin_lama, 'so_ok' as so_ok, d.provinsi");
        $this->db->from("tb_do_dtl a");
        $this->db->join("tb_do_hdr b", "a.id_do = b.id_do");
        $this->db->join("tb_so_hdr c", "b.id_so = c.id_so");
        $this->db->join("m_customers d", "b.id_customers = d.id_customers", "left");
        $this->db->where("a.nbarcode", $barcode);
        $this->db->where("c.flag_cancel", '0');
        $this->db->order_by("a.id_do_dtl", "desc");
        $this->db->limit(1);

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->row_array();
        } else {
            return false; 
        }
    }

    public function data_kategori()
    {
        return $this->db->get('m_product_kategori');
    }

    public function data_satuan()
    {
        return $this->db->get('m_product_satuan');
    }

    public function data_brand()
    {
        return $this->db->get('m_product_brand');
    }

    public function data_sub_kategori()
    {
        return $this->db->get('m_product_sub_kategori');
    }

    public function insert($NewID, $t_d, $d_r, $sn_number, $warranty, $product, $sts_pasang, $do_code, $mesin_lama, $csr_by, $csr_input, $tambahthn, $stat_csr, $customers, $requestor, $lokasi, $lap_kerusakan, $link_foto)
    {
        $data = array(
            'csr_code' => $NewID,
            'csr_date' => $d_r,
            'id_customers' => $customers,
            'id_karyawan' => $requestor,
            'barcode' => $sn_number,
            'do_code' => $do_code,
            'waranty_start' => $t_d,
            'waranty_time' => $warranty,
            'waranty_end' => $tambahthn,
            'lap_kerusakan' => $lap_kerusakan,
            'id_product' => $product,
            'lokasi' => $lokasi,
            'csr_input_date' => $csr_input,
            'csr_by' => $csr_by,
            'csr_status' => $stat_csr,
            'sts_pasang' => $sts_pasang,
            'mesin_lama' => $mesin_lama,
            'image' => $link_foto

        );
        $this->db->insert('tb_afs_csr', $data);

        // Tambahkan baris awal ke tb_afs_cst dengan cst_code = 'kosong'
        $id_afs_csr = $this->db->insert_id();
        $data_cst = array(
            'id_afs_csr' => $id_afs_csr,
            'cst_code' => 'kosong',
            'cst_date' => null,
            'status' => null
        );
        $this->db->insert('tb_afs_cst', $data_cst);
    }

    public function data_header($id_karyawan)
    {
        return $this->db->query("select * from m_karyawan where id_karyawan = '$id_karyawan'");
    }

    public function data_customers()
    {
        $this->db->order_by('nm_customers', 'ASC');
        return $this->db->get('m_customers');
    }

    public function data_barang()
    {
        return $this->db->get('m_product');
    }

    public function data_karyawan()
    {
        $this->db->order_by('nm_karyawan', 'ASC');
        return $this->db->get('m_karyawan');
    }

    public function data_type_kerusakan()
    {
        return $this->db->get('m_type_kerusakan');
    }


    public function get_product_by_sn($sn_number)
    {
        $this->db->select('*');
        $this->db->from('produk');
        $this->db->where('sn_number', $sn_number);
        $query = $this->db->get();

        if ($query->num_rows() > 0) {
            return $query->row();
        } else {
            return false;
        }
    }

    public function update($csr_code, $customers, $csr_date, $id_karyawan,   $lap_kerusakan, $lokasi, $sts_pasang, $link_foto)
    {
        $data = array(
            'id_customers' => $customers,
            'csr_date' => $csr_date,
            'id_karyawan' => $id_karyawan,
            'lap_kerusakan' => $lap_kerusakan,
            'lokasi' => $lokasi,
            'sts_pasang' => $sts_pasang
        );
        if ($link_foto != null) {
            $data['image'] = $link_foto;
        }
        $this->db->where('csr_code', $csr_code);
        $this->db->update('tb_afs_csr', $data);
    }

    public function updateConfrimCSR($cst_code, $cst_date, $status, $approved_csr_by, $cst_input_date, $csr_code)
    {
        $this->db->select('id_afs_csr, csr_date');
        $this->db->where('csr_code', $csr_code);
        $query = $this->db->get('tb_afs_csr');
        $row = $query->row();
        
        if ($row && strtotime($cst_date) < strtotime($row->csr_date)) {
            return false; 
        }

        $data = array(
            'csr_status' => $status,
            'approved_csr_by' => $approved_csr_by,
            'csr_approve_date' => $cst_input_date
        );

        $this->db->where('csr_code', $csr_code);
        $this->db->update('tb_afs_csr', $data);

        // $data3 = array(
        //     'mobile_number' => $mobile_cust,
        //     'message' => $message_tic,
        //     'username_create' => $wa_by,
        //     'flag_status' => $flag_status,
        //     'date_create' => $translog_date_cus,
        //     'date_update' => $translog_date_cus,
        //     'flag_group' => $flag_group_2
        // );
        // $this->db->insert('tb_message_wa', $data3);
        
        if ($row && isset($row->id_afs_csr)) {
            $id_afs_csr = $row->id_afs_csr;
            $data_cst = array(
                'cst_code' => $cst_code,
                'cst_date' => date('Y-m-d', strtotime($cst_date)),
                'status'   => $status
            );

            // Cari apakah ada baris CST yang masih 'kosong' atau baris terbaru yang tidak dibatalkan
            $this->db->where('id_afs_csr', $id_afs_csr);
            $this->db->where_in('status', array(NULL, 'OUTSTANDING'));
            $this->db->where('cst_code', 'kosong');
            $cek_cst = $this->db->get('tb_afs_cst');

            if ($cek_cst->num_rows() > 0) {
                // Update baris placeholder 'kosong' yang ada
                $this->db->where('id_afs_csr', $id_afs_csr);
                $this->db->where('cst_code', 'kosong');
                $this->db->update('tb_afs_cst', $data_cst);
            } else {
                // Jika tidak ada placeholder 'kosong' (mungkin sebelumnya sudah dibatalkan), 
                // buat baris baru untuk mendukung "1 CSR bisa banyak CST"
                $data_cst['id_afs_csr'] = $id_afs_csr;
                $this->db->insert('tb_afs_cst', $data_cst);
            }
        }

        return true;
    }

    public function updateCSRcancel($csr_code, $stat2, $memo)
    {
        $data = array(
            'csr_status' => $stat2,
            'f_cancel' => 1,
            'alasan_cancel' => $memo
        );

        $this->db->where('csr_code', $csr_code);
        $this->db->update('tb_afs_csr', $data);
    }
    // $data2 = array(
    //     'mobile_number' => $mobile_number,
    //     'message' => $message,
    //     'username_create' => $wa_by,
    //     'flag_status' => $flag_status,
    //     'date_create' => $translog_date_cus,
    //     'date_update' => $translog_date_cus,
    //     'flag_group' => $flag_group
    // );

    // $this->db->insert('tb_message_wa', $data2);

    public function ignoreCSR($csr_code, $cst_date, $status)
    {
        $this->db->select('id_afs_csr');
        $this->db->where('csr_code', $csr_code);
        $query = $this->db->get('tb_afs_csr');
        $row = $query->row();

        if ($row && isset($row->id_afs_csr)) {
            $data = array(
                'status' => $status,
                'cst_date' => date('Y-m-d', strtotime($cst_date))
            );
            $this->db->where('id_afs_csr', $row->id_afs_csr);
            return $this->db->update('tb_afs_cst', $data);
        }
        
        return false;
    }

    public function wa1($id_wa, $mobile_number, $message, $wa_by, $flag_status, $translog_date_cus, $flag_group)
    {
        $data = array(
            'id_message_wa' => $id_wa,
            'mobile_number' => $mobile_number,
            'message' => $message,
            'username_create' => $wa_by,
            'flag_status' => $flag_status,
            'date_create' => $translog_date_cus,
            'date_update' => $translog_date_cus,
            'flag_group' => $flag_group,
        );

        $this->db->insert('tb_message_wa', $data);
    }
    public function wa2($id_wa, $mobile_cust, $message_tic, $wa_by, $flag_status, $translog_date_cus, $flag_group2)
    {
        $data = array(
            'id_message_wa' => $id_wa,
            'mobile_number' => $mobile_cust,
            'message' => $message_tic,
            'username_create' => $wa_by,
            'flag_status' => $flag_status,
            'date_create' => $translog_date_cus,
            'date_update' => $translog_date_cus,
            'flag_group' => $flag_group2,
        );

        $this->db->insert('tb_message_wa', $data);
    }


    public function translog($id_log, $translog_date, $kode_trans, $user_log, $action_log, $table_name, $form_log)
    {
        $data = array(
            'id_trans_swo_log' => $id_log,
            'translog_date' => $translog_date,
            'kode_trans' => $kode_trans,
            'user_id' => $user_log,
            'action' => $action_log,
            'table_name' => $table_name,
            'form' => $form_log,
        );

        $this->db->insert('tb_trans_swo_log', $data);
    }
    public function add_new_cst($csr_code)
    {
        $this->db->select('id_afs_csr');
        $this->db->where('csr_code', $csr_code);
        $query = $this->db->get('tb_afs_csr');
        $row = $query->row();

        if ($row) {
            $id_afs_csr = $row->id_afs_csr;

            $today = date('Y');
            $todayM = date('m');
            $this->db->select('MAX(SUBSTRING(cst_code, 17, 5)) AS maxKode');
            $this->db->where('SUBSTRING(cst_code, 9, 4) =', $today);
            $this->db->where('SUBSTRING(cst_code, 14, 2) =', $todayM);
            $query_cst = $this->db->get('tb_afs_cst');
            $result3 = $query_cst->row_array();
            $noUrut3 = (int) $result3['maxKode'];
            $noUrut3++;
            $cst_code = 'CST-EMM' . '/' . $today . '/' . $todayM . '/' . sprintf('%05s', $noUrut3);

            $data_cst = array(
                'id_afs_csr' => $id_afs_csr,
                'cst_code' => $cst_code,
                'cst_date' => date('Y-m-d'),
                'status'   => 'OUTSTANDING'
            );
            $this->db->insert('tb_afs_cst', $data_cst);
            return $cst_code;
        }
        return false;
    }
}


/* End of file Mmaster.php */