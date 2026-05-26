<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Cform extends CI_Controller
{

    public $global = array();
    public $id_menu = '10604';

    public function __construct()
    {
        parent::__construct();
        cek_session();

        $data = check_role($this->id_menu, 2);
        if (!$data) {
            redirect(base_url(), 'refresh');
        }

        $this->global['folder'] = $data[0]['nm_folder'];
        $this->global['title'] = $data[0]['nm_menu'];

        $this->load->model($this->global['folder'] . '/mmaster');
    }

    public function index()
    {
        $search = $this->input->get('search');
        // $this->load->library('paginationcustom');

        // $config['base_url'] = base_url() . $this->global['folder'] . '/cform/index/';
        // $config['per_page'] = '9999999';
        // $config['first_link'] = 'Awal';
        // $config['last_link'] = 'Akhir';
        // $config['next_link'] = 'Selanjutnya';
        // $config['prev_link'] = 'Sebelumnya';
        // $config['cur_page'] = $this->uri->segment(4);

        // $config['reuse_query_string'] = true;

        // $limit = $config['per_page'];
        // $offset = $config['cur_page'];

        $start_date = $this->input->get('start_date');
        $end_date   = $this->input->get('end_date');
        $all        = $this->input->get('all');

        $isi = $this->mmaster->bacasemua($search, $start_date, $end_date, $all);

        // $config['total_rows'] = $isi['total'];
        // $this->paginationcustom->initialize($config);

        $data = array(
            'folder' => $this->global['folder'],
            'title'  => $this->global['title'],
            'isi'    => $isi['data'],
            // 'links' => $this->paginationcustom->create_links(),
            'search' => $search,
        );

        $this->Logger->write('Membuka Menu ' . $this->global['title']);

        $this->load->view($this->global['folder'] . '/vformlist', $data);
    }

    public function data()
    {
        echo $this->mmaster->data($this->id_menu, $this->global['folder']);
    }

    public function edit()
    {

        $id_product = $this->uri->segment('4');
        $f_edit     = $this->uri->segment('5');

        $cst_code = str_replace(".", "/", $id_product);
        $lkt_code = str_replace(".", "/", $id_product);

        if ($f_edit == 't') {
            $this->Logger->write('Membuka Menu Edit ' . $this->global['title'] . ' Kode :  ' . $id_product);
            $title  = 'Edit ';
            $f_edit = true;
        } else {
            $this->Logger->write('Membuka Menu Data ' . $this->global['title']) . ' Kode : ' . $id_product;
            $title  = 'Data ';
            $f_edit = false;
        }

        $isi  = $this->mmaster->bacadetail($cst_code);
        $isi2 = $this->mmaster->bacadetail2($cst_code);

        $data = array(
            'folder'           => $this->global['folder'],
            'title'            => $title . $this->global['title'],
            'title_list'       => 'Daftar ' . $this->global['title'],
            'f_edit'           => $f_edit,
            'isi'              => $isi['data'],
            'isi2'             => $isi2['data'],
            'data'             => $this->mmaster->data_header($id_product)->row(),
            'data_kategori'    => $this->mmaster->data_kategori(),
            'data_sub_kategori'=> $this->mmaster->data_sub_kategori(),
        );

        $this->load->view($this->global['folder'] . '/vformedit', $data);
    }

    public function close_cst()
    {
        $cst_code = $this->input->post('cst_code');

        if ($this->mmaster->check_lkt_done($cst_code) == 0) {
            echo json_encode(array('status' => 'error', 'message' => 'LKT Belum DONE oleh Teknisi !!'));
            return;
        }

        $cst_approve_date = date('Y-m-d H:i:s');
        $approved_cst_by  = $this->session->userdata('username');
        $cst_done_date    = date('Y-m-d H:i:s');
        $done_cst_by      = $this->session->userdata('username');
        $stat_csr         = 'DONE';
        $status           = 'DONE';

        $affected_rows = $this->mmaster->updateCstclose($cst_code, $stat_csr, $status, $cst_approve_date, $approved_cst_by, $cst_done_date, $done_cst_by);

        $query_log = $this->db->query("SELECT MAX(id_trans_swo_log) as maxKode FROM tb_trans_swo_log");
        $result2   = $query_log->row_array();
        $kodelog   = $result2['maxKode'];
        $noUrut2   = $kodelog;
        $noUrut2++;
        $id_log = $noUrut2++;

        $translog_date = date('Y-m-d H:i:s');
        $kode_trans    = $cst_code;
        $user_log      = $this->session->userdata('username');
        $action_log    = 'Done CST';
        $table_name    = 'tb_afs_cst';
        $form_log      = 'CST';

        $this->mmaster->translog($id_log, $translog_date, $kode_trans, $user_log, $action_log, $table_name, $form_log);

        if ($affected_rows > 0) {
            echo json_encode(array('status' => 'success', 'message' => 'CST updated successfully.'));
        } else {
            echo json_encode(array('status' => 'error', 'message' => 'Error updating CST.'));
        }
    }

    public function cancel()
    {
        $cst_code = $this->input->post('cst_code');

        $this->mmaster->updateCSTcancel($cst_code);

        $query_log = $this->db->query("SELECT MAX(id_trans_swo_log) as maxKode FROM tb_trans_swo_log");
        $result2   = $query_log->row_array();
        $kodelog   = $result2['maxKode'];
        $noUrut2   = $kodelog;
        $noUrut2++;
        $id_log = $noUrut2++;

        $translog_date = date('Y-m-d H:i:s');
        $kode_trans    = $cst_code;
        $user_log      = $this->session->userdata('username');
        $action_log    = 'Cancel CST';
        $table_name    = 'tb_afs_cst';
        $form_log      = 'CST';

        $this->mmaster->translog($id_log, $translog_date, $kode_trans, $user_log, $action_log, $table_name, $form_log);

        echo json_encode(array('status' => true));
    }
}

/* End of file Cform.php */