<?php

defined('BASEPATH') or exit('No direct script access allowed');

use Ozdemir\Datatables\Datatables;
use Ozdemir\Datatables\DB\CodeigniterAdapter;

class Mmaster extends CI_Model
{
    public function data($i_menu, $folder)
    {
        $datatables = new Datatables(new CodeigniterAdapter);
        $datatables->query("SELECT
            b.csr_date, a.cst_date, a.cst_code, b.csr_code,
            c.nm_customers, d.code_product, e.nm_karyawan, a.status, '$folder' as folder
        FROM tb_afs_cst a
        JOIN tb_afs_csr b ON a.id_afs_csr = b.id_afs_csr
        JOIN m_karyawan e ON b.id_karyawan = e.id_karyawan
        JOIN m_customers c ON b.id_customers = c.id_customers
        JOIN m_product d ON b.id_product = d.id_product
        WHERE b.f_cancel = 0
        ");
        $datatables->hide('folder');
        $datatables->hide('cst_code');
        $no = 1;

        $datatables->edit('cst_code', function ($data) use ($folder) {
            $cst_code = $data['cst_code'];
            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$cst_code/f\",\"#main\"); return false;'>$cst_code</a>";
            return $hasil;
        });

        $datatables->edit('cst_date', function ($data) use ($folder) {
            $date_cst = date("d-m-Y", strtotime($data['cst_date']));
            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$date_cst/f\",\"#main\"); return false;'>$date_cst</a>";
            return $hasil;
        });

        $datatables->edit('nm_customers', function ($data) use ($folder) {
            $nm_customers = $data['nm_customers'];
            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$nm_customers/f\",\"#main\"); return false;'>$nm_customers</a>";
            return $hasil;
        });

        $datatables->edit('csr_code', function ($data) use ($folder) {
            $csr_code = $data['csr_code'];
            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$csr_code/f\",\"#main\"); return false;'><b>" . substr($csr_code, 16) . "</b></a>";
            return $hasil;
        });

        $datatables->edit('nm_karyawan', function ($data) use ($folder) {
            $nm_karyawan = $data['nm_karyawan'];
            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$nm_karyawan/f\",\"#main\"); return false;'>$nm_karyawan</a>";
            return $hasil;
        });

        $datatables->edit('status', function ($data) use ($folder) {
            $status = $data['status'];
            $badge = '';
            switch ($status) {
                case 'DRAFT':
                    $badge = 'warning';
                    break;
                case 'OUTSTANDING':
                    $badge = 'dark';
                    break;
                case 'CANCELED':
                    $badge = 'info';
                    break;
                case 'SALES ORDER':
                    $badge = 'secondary';
                    break;
                case 'READY TO DELIVER':
                    $badge = 'success';
                    break;
                default:
                    $badge = 'primary';
            }
            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$status/f\",\"#main\"); return false;'><span class=\"badge badge-$badge\">$status</span></a>";
            return $hasil;
        });

        return $datatables->generate();
    }

    public function bacasemua($search, $start_date, $end_date, $all)
    {
        $this->db->select('
            tb_afs_cst.cst_code,
            tb_afs_cst.cst_date,
            tb_afs_cst.status,
            tb_afs_csr.csr_code,
            tb_afs_csr.csr_date,
            tb_afs_csr.f_cancel,
            tb_afs_csr.approved_csr_by,
            m_karyawan.nm_karyawan,
            m_customers.nm_customers,
            m_product.nm_product,
            m_product.code_product
        ');
        $this->db->from('tb_afs_cst');
        $this->db->join('tb_afs_csr', 'tb_afs_cst.id_afs_csr = tb_afs_csr.id_afs_csr');
        $this->db->join('m_karyawan', 'tb_afs_csr.id_karyawan = m_karyawan.id_karyawan');
        $this->db->join('m_customers', 'tb_afs_csr.id_customers = m_customers.id_customers');
        $this->db->join('m_product', 'tb_afs_csr.id_product = m_product.id_product');
        $this->db->where("tb_afs_cst.cst_code <> 'kosong'");

        if (empty($start_date)) {
            $start_date = date('Y-m-01');
        }

        if (empty($end_date)) {
            $end_date = date('Y-m-d');
        }

        $all = empty($all) ? false : true;

        if (!$all) {
            $this->db->where('tb_afs_cst.cst_date >=', $start_date);
            $this->db->where('tb_afs_cst.cst_date <=', $end_date);
        }

        if ($search) {
            $array_like = explode(',', $search);

            if ($array_like) {
                $this->db->group_start();

                foreach ($array_like as $key => $value) {
                    if ($key == 0) {
                        $this->db->like('tb_afs_csr.csr_code', $value);
                        $this->db->like('tb_afs_cst.cst_code', $value);
                        $this->db->like('nm_customers', $value);
                        $this->db->like('code_product', $value);
                        $this->db->like('nm_karyawan', $value);
                        $this->db->like('tb_afs_cst.status', $value);
                    } else {
                        $this->db->or_like('tb_afs_csr.csr_code', $value);
                        $this->db->or_like('tb_afs_cst.cst_code', $value);
                        $this->db->or_like('nm_customers', $value);
                        $this->db->or_like('code_product', $value);
                        $this->db->or_like('nm_karyawan', $value);
                        $this->db->or_like('tb_afs_cst.status', $value);
                    }
                }
                $this->db->group_end();
            }
        }

        $this->db->group_by('tb_afs_csr.csr_code, tb_afs_cst.cst_code, m_customers.nm_customers, m_product.code_product, m_karyawan.nm_karyawan, m_product.nm_product, tb_afs_cst.status, tb_afs_csr.csr_date, tb_afs_csr.f_cancel, tb_afs_csr.approved_csr_by, tb_afs_cst.cst_date');
        $this->db->order_by('tb_afs_cst.cst_code', 'DESC');

        $count = $this->db->count_all_results('', false);
        $count = intval($count);


        // $this->db->limit($limit, $start);

        $query = $this->db->get();

        return array(
            'data' => $query,
            'total' => $count,
        );
    }


    public function bacadetail($cst_code)
    {
        $this->db->select('
            tb_afs_cst.id_afs_cst,
            tb_afs_cst.id_afs_csr,
            tb_afs_cst.cst_code,
            tb_afs_cst.cst_date,
            tb_afs_cst.status,
            tb_afs_cst.approve_cst,
            tb_afs_cst.approved_cst_by,
            tb_afs_cst.done_cst_by,
            tb_afs_cst.ignore_cst_by,
            tb_afs_cst.cst_approve_date,
            tb_afs_cst.cst_ignore_date,
            tb_afs_cst.cst_done_date,
            tb_afs_csr.csr_code,
            tb_afs_csr.csr_date,
            tb_afs_csr.so_date,
            tb_afs_csr.id_customers,
            tb_afs_csr.id_product,
            tb_afs_csr.id_karyawan,
            tb_afs_csr.barcode,
            tb_afs_csr.do_code,
            tb_afs_csr.waranty_start,
            tb_afs_csr.waranty_time,
            tb_afs_csr.waranty_end,
            tb_afs_csr.lap_kerusakan,
            tb_afs_csr.lokasi,
            tb_afs_csr.sts_pasang,
            tb_afs_csr.f_cancel,
            tb_afs_csr.image,
            tb_afs_csr.alasan_cancel,
            tb_afs_csr.csr_status,
            tb_afs_csr.approved_csr_by,
            m_karyawan.nm_karyawan,
            m_customers.nm_customers,
            m_customers.customers_mobile,
            tb_so_hdr.customers_address,
            tb_so_hdr.keterangan,
            m_product.nm_product,
            m_product.code_product,
            m_product.id_product_kategori,
            m_product_kategori.nm_product_kategori
        ');
        $this->db->from('tb_afs_cst');
        $this->db->join('tb_afs_csr', 'tb_afs_cst.id_afs_csr = tb_afs_csr.id_afs_csr');
        $this->db->join('m_karyawan', 'tb_afs_csr.id_karyawan = m_karyawan.id_karyawan');
        $this->db->join('m_customers', 'tb_afs_csr.id_customers = m_customers.id_customers');
        $this->db->join('m_product', 'tb_afs_csr.id_product = m_product.id_product');
        $this->db->join('tb_do_hdr', 'tb_afs_csr.do_code = tb_do_hdr.code_do', 'left');
        $this->db->join('m_product_kategori', 'm_product.id_product_kategori = m_product_kategori.id_product_kategori', 'left');
        $this->db->join('tb_so_hdr', 'tb_do_hdr.id_so = tb_so_hdr.id_so', 'left');
        $this->db->where('tb_afs_cst.cst_code', $cst_code);

        $this->db->order_by('tb_afs_cst.cst_code', 'DESC');

        $count = $this->db->count_all_results('', false);
        $count = intval($count);

        $query = $this->db->get();

        return array(
            'data' => $query,
            'total' => $count,
        );
    }

    public function bacadetail2($cst_code)
    {
        $this->db->select('tb_afs_lkt.*, tb_afs_csr.id_customers, m_customers.nm_customers');
        $this->db->from('tb_afs_lkt');
        $this->db->join('tb_afs_cst', 'tb_afs_lkt.id_afs_cst = tb_afs_cst.id_afs_cst');
        $this->db->join('tb_afs_csr', 'tb_afs_cst.id_afs_csr = tb_afs_csr.id_afs_csr');
        $this->db->join('m_customers', 'tb_afs_csr.id_customers = m_customers.id_customers');
        $this->db->where('tb_afs_lkt.f_cancel', '0');
        $this->db->where('tb_afs_cst.cst_code', $cst_code);

        $this->db->order_by('tb_afs_cst.cst_code', 'DESC');

        $count = $this->db->count_all_results('', false);
        $count = intval($count);

        $query = $this->db->get();

        return array(
            'data' => $query,
            'total' => $count,
        );
    }

    // public function totsparepart($lkt_code)
    // {
    //     $this->db->select("SUM(CASE WHEN f_cancel = 0 THEN total ELSE 0 END) as total", false);
    //     $this->db->from('tb_trans_swo_part_actual');
    //     $this->db->where('lkt_code', $lkt_code);

    //     $count = $this->db->count_all_results('', false);
    //     $count = intval($count);

    //     $query = $this->db->get();

    //     return array(
    //         'data' => $query,
    //         'total' => $count,
    //     );
    // }

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

    public function insert($id_product, $product_code, $nm_product, $deskripsi, $id_category, $id_sub_category, $id_satuan,  $id_brand, $reference)
    {

        $data = array(
            'id_product' => $id_product,
            'code_product' => $product_code,
            'nm_product' => $nm_product,
            'product_deskripsi' => $deskripsi,
            'id_product_kategori' => $id_category,
            'id_product_sub_kategori' => $id_sub_category,
            'id_product_satuan' => $id_satuan,
            'id_product_brand' => $id_brand,
            'product_refference' => $reference,
            'date_create' => current_datetime(),
        );

        $this->db->insert('m_product', $data);
    }

    public function update(
        $id_product,
        $code_product,
        $nm_product,
        $id_product_kategori,
        $product_deskripsi,
        $id_product_sub_kategori,
        $id_product_satuan,
        $id_product_brand,
        $product_refference
    ) {

        $data = array(
            'id_product' => $id_product,
            'code_product' => $code_product,
            'nm_product' => $nm_product,
            'id_product_kategori' => $id_product_kategori,
            'product_deskripsi' => $product_deskripsi,
            'id_product_sub_kategori' => $id_product_sub_kategori,
            'id_product_satuan' => $id_product_satuan,
            'id_product_brand' => $id_product_brand,
            'product_refference' => $product_refference,
            'date_update' => current_datetime(),
        );

        $this->db->where('id_product', $id_product);
        $this->db->update('m_product', $data);
    }

    public function data_header($id_product)
    {
        return $this->db->query("select * from m_product where id_product = '$id_product'");
    }

    public function getAllProducts()
    {
        $query = $this->db->get('m_product');
        return $query->result_array();
    }

    public function data_customers()
    {
        return $this->db->get('m_customers');
    }

    public function data_barang()
    {
        return $this->db->get('m_product');
    }

    public function data_karyawan()
    {
        return $this->db->get('m_karyawan');
    }

    public function data_type_kerusakan()
    {
        return $this->db->get('m_type_kerusakan');
    }


    public function updateCstclose($cst_code, $stat_csr, $status, $cst_approve_date, $approved_cst_by, $cst_done_date, $done_cst_by)
    {
        // Update status CST di tb_afs_cst
        $data_cst = array(
            'status'           => $status,
            'cst_approve_date' => $cst_approve_date,
            'approved_cst_by'  => $approved_cst_by,
            'done_cst_by'      => $done_cst_by,
            'cst_done_date'    => $cst_done_date,
        );

        $this->db->where('cst_code', $cst_code);
        $this->db->update('tb_afs_cst', $data_cst);
        $affected = $this->db->affected_rows();

        // Update csr_status di tb_afs_csr melalui relasi id_afs_csr
        $row = $this->db->query(
            "SELECT id_afs_csr FROM tb_afs_cst WHERE cst_code = ?",
            array($cst_code)
        )->row();

        if ($row) {
            $data_csr = array('csr_status' => $stat_csr);
            $this->db->where('id_afs_csr', $row->id_afs_csr);
            $this->db->update('tb_afs_csr', $data_csr);
        }

        return $affected;
    }

    public function updateCSTcancel($cst_code)
    {
        // Ambil id_afs_csr dari cst_code di tb_afs_cst
        $row = $this->db->query(
            "SELECT id_afs_csr FROM tb_afs_cst WHERE cst_code = ?",
            array($cst_code)
        )->row();

        if ($row) {
            $this->db->set('csr_status', 'OUTSTANDING');
            $this->db->set('f_cancel', '0');
            $this->db->where('id_afs_csr', $row->id_afs_csr);
            $this->db->update('tb_afs_csr');

            $this->db->set('status', 'CANCEL');
            $this->db->where('cst_code', $cst_code);
            $this->db->update('tb_afs_cst');
        }
    }

    public function check_lkt_done($cst_code)
    {
        return $this->db->query("
            SELECT COUNT(a.lkt_code) AS jml
            FROM tb_afs_lkt a
            JOIN tb_afs_cst b ON a.id_afs_cst = b.id_afs_cst
            WHERE b.cst_code = ? AND a.flag_done = 'DONE' AND a.f_cancel = 0", array($cst_code))->row()->jml;
    }

    public function translog($id_log, $translog_date, $kode_trans, $user_log, $action_log, $table_name, $form_log)
    {
        $data = array(
            'id_trans_swo_log' => $id_log,
            'translog_date'    => $translog_date,
            'kode_trans'       => $kode_trans,
            'user_id'          => $user_log,
            'action'           => $action_log,
            'table_name'       => $table_name,
            'form'             => $form_log,
        );

        $this->db->insert('tb_trans_swo_log', $data);
    }
}
/* End of file Mmaster.php */
