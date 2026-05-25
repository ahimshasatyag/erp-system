<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Cform extends CI_Controller
{

    public $global = array();
    public $id_menu = '10603';

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
        $end_date = $this->input->get('end_date');
        $all = $this->input->get('all');

        $isi = $this->mmaster->bacasemua($search, $start_date, $end_date, $all);

        // $config['total_rows'] = $isi['total'];

        // $this->paginationcustom->initialize($config);

        $data = [
            'folder' => $this->global['folder'],
            'title' => $this->global['title'],
            'isi' => $isi['data'],
            // 'links' => $this->paginationcustom->create_links(),
            'search' => $search,
        ];

        $this->Logger->write('Membuka Menu ' . $this->global['title']);

        $this->load->view($this->global['folder'] . '/vformlist', $data);
    }

    public function data()
    {
        echo $this->mmaster->data($this->id_menu, $this->global['folder']);
    }

    public function tambah()
    {

        $data = check_role($this->id_menu, 1);
        if (!$data) {
            redirect(base_url(), 'refresh');
        }

        $data = array(
            'folder' => $this->global['folder'],
            'title' => "Tambah " . $this->global['title'],
            'title_list' => 'Daftar ' . $this->global['title'],
            'data_satuan' => $this->mmaster->data_satuan(),
            'data_brand' => $this->mmaster->data_brand(),
            'data_kategori' => $this->mmaster->data_kategori(),
            'data_sub_kategori' => $this->mmaster->data_sub_kategori(),
            'data_customers' => $this->mmaster->data_customers(),
            'data_barang' => $this->mmaster->data_barang(),
            'data_type_kerusakan' => $this->mmaster->data_type_kerusakan(),
            'data_karyawan' => $this->mmaster->data_karyawan(),

        );

        $this->Logger->write('Membuka Menu Tambah ' . $this->global['title']);

        $this->load->view($this->global['folder'] . '/vformadd', $data);
    }

    public function simpan()
    {
        $data = check_role($this->id_menu, 1);
        if (!$data) {
            redirect(base_url(), 'refresh');
        }

        $this->form_validation->set_rules('sn_number', 'SN Number', 'trim|required');
        $this->form_validation->set_rules('id_product', 'ID Product', 'trim');
        $this->form_validation->set_rules('sts_pasang', 'Status Pasang', 'trim');
        $this->form_validation->set_rules('do_code', 'DO Code', 'trim');
        $this->form_validation->set_rules('mesin_lama', 'Mesin Lama', 'trim');
        $this->form_validation->set_rules('id_customers', 'ID Customers', 'trim');
        $this->form_validation->set_rules('date_request', 'Date Request', 'trim');
        $this->form_validation->set_rules('created_date', 'Created Date', 'trim');
        $this->form_validation->set_rules('id_karyawan', 'ID Karyawan', 'trim');
        $this->form_validation->set_rules('id_karyawan', 'Requestor', 'trim|required');
        $this->form_validation->set_rules('lokasi', 'Lokasi', 'trim|required');
        $this->form_validation->set_rules('lap_kerusakan', 'Laporan Kerusakan', 'trim|required');
        $this->form_validation->set_rules('sts_pasang', 'Status Pemasangan', 'trim|required');
        $this->form_validation->set_rules('warranty_time', 'Warranty Time', 'trim');
        $this->form_validation->set_rules('warranty_start', 'Warranty Start ', 'trim');
        $this->form_validation->set_rules('warranty_end', 'Warranty End', 'trim');


        if ($this->form_validation->run() == false) {
            $view_data = array(
                'sukses' => false,
            );
            $this->load->view('pesan', $view_data);
        } else {
            $this->db->trans_begin();

            $customers = $this->input->post('customers');
            $date_request = $this->input->post('date_request');
            $product = $this->input->post('id_product');
            $sts_pasang = $this->input->post('sts_pasang');
            $do_code = $this->input->post('do_code');
            $mesin_lama = $this->input->post('mesin_lama');
            $requestor = $this->input->post('id_karyawan');
            $lokasi = $this->input->post('lokasi');
            $lap_kerusakan = $this->input->post('lap_kerusakan');
            $sn_number = $this->input->post('sn_number');
            $csr_input = $this->input->post('csr_input_date');
            $tgl_delivered = $this->input->post('tgl_delivered');
            $warranty = $this->input->post('warranty_time');
            $tambahthn = $this->input->post('waranty_end');
            $d_r = $this->input->post('d_r');



            $warranty = '12';
            $today = date('Y');
            $todayM = date('m');

            if ($date_request !== null) {
                $d_r = (new DateTime($date_request))->format("Y-m-d");
            } else {
                echo "Kesalahan: Nilai \$date_request tidak valid.";
                die;
            }

            if ($tgl_delivered !== null) {
                $t_d = (new DateTime($tgl_delivered))->format("Y-m-d");
            } else {
                echo "Kesalahan: Nilai \$tgl_delivered tidak valid.";
                die;
            }

            $tambahthn = date('Y-m-d', strtotime('+1 year', strtotime($t_d)));

            $so_query = "select x.* from(
                select
                    sum(a.name) as 'total_extend'
                from
                    tb_so_dtl_extend_warranty a
                inner join tb_so_hdr b on
                    (a.so_id = b.id_so)
                inner join tb_do_hdr c on
                    (b.id_so = c.id_so)
                where
                    c.code_do = '$do_code'
                    and a.status = 'CONFIRM'
                    ) as x where x.total_extend > 0";
            $hasil4 = $this->db->query($so_query);
            // $so_id = $hasil4['id_so'] ?? 0;

            if ($hasil4->num_rows() > 0) {

                $totalConfirm = $hasil4->row_array()['total_extend'] ?? 0;

                // $confirmResult = $this->db->query($confirmQuery)->row_array();
                // $totalConfirm = $confirmResult['totalConfirm'] ?? 0;

                $tambahthn = date('Y-m-d', strtotime('+' . $totalConfirm . ' days', strtotime($tambahthn)));
            }


            $csr_input = date('Y-m-d H:i:s');
            $csr_by = $this->session->userdata('username');
            $stat_csr = 'DRAFT';
            $query2 = "SELECT MAX(csr_code) AS maxKode FROM tb_afs_csr";
            $hasil = $this->db->query($query2)->row_array();
            $kodeCSR = $hasil['maxKode'];
            $noUrut = (int)substr($kodeCSR, 16, 5);
            $noUrut++;
            $NewID = 'CSR-EMM' . '/' . $today . '/' . $todayM . '/' . sprintf('%05s', $noUrut);

            $link_foto = null;

            $this->load->library('upload');

            $config['upload_path'] = './assets/upload/afs/';
            $config['allowed_types'] = 'png|jpg|jpeg|bmp';
            $config['encrypt_name'] = true;
            $this->upload->initialize($config);

            if (!empty($_FILES['link_foto']['name'])) {
                if ($this->upload->do_upload('link_foto')) {
                    $gbr = $this->upload->data();
                    $link_foto = $gbr['file_name'];
                } else {
                    $error = $this->upload->display_errors();
                    echo "Upload gagal: " . $error;
                }
            }

            $this->mmaster->insert($NewID, $t_d, $d_r, $sn_number, $warranty, $product, $sts_pasang, $do_code, $mesin_lama, $csr_by, $csr_input, $tambahthn, $stat_csr, $customers, $requestor, $lokasi, $lap_kerusakan, $link_foto);

            $query_log = $this->db->query("SELECT MAX(id_trans_swo_log) as maxKode FROM tb_trans_swo_log");
            $result2 = $query_log->row_array();
            $kodelog = $result2['maxKode'];
            $noUrut2 = $kodelog;
            $noUrut2++;
            $id_log =  $noUrut2++;

            $translog_date = date('Y-m-d H:i:s');
            $kode_trans = $NewID;
            $user_log = $this->session->userdata('username');
            $action_log = 'insert CSR';
            $table_name = 'tb_afs_csr';
            $form_log = 'CSR';

            $this->mmaster->translog($id_log, $translog_date, $kode_trans, $user_log, $action_log, $table_name, $form_log);

            $query_wa = $this->db->query("SELECT MAX(id_message_wa) as maxKode FROM tb_message_wa");
            $result3 = $query_wa->row_array();
            $kodewa = $result3['maxKode'];
            $noUrut3 = $kodewa;
            $noUrut3++;
            $id_wa =  $noUrut3++;

            $wa_input = date('d-m-Y H:i:s');
            $this->db->where('id_customers', $customers);
            $query_wa = $this->db->get('m_customers');
            $tm_sql_wa = $query_wa->row_array();
            $nm_cs_wa = isset($tm_sql_wa['nm_customers']) ? $tm_sql_wa['nm_customers'] : '';

            $this->db->where('id_product', $product);
            $query_pr_code = $this->db->get('m_product');
            $tm_sql_pr = $query_pr_code->row_array();
            $nm_cs_pr = isset($tm_sql_pr['code_product']) ? $tm_sql_pr['code_product'] : '';

            $mobile_number = '62818777535-1541378496';
            $message = "Telah diinput oleh " . $csr_by . "\n";
            $message .= "tanggal : " . $wa_input . "\n";
            $message .= "\nNo CSR : " . $NewID . "\n";
            $message .= "\nCustomer : " . $nm_cs_wa . "\n";
            $message .= "\nModel mesin : " . $nm_cs_pr . "\n";
            $message .= "\nTgl Kirim Mesin : " . $tgl_delivered . "\n";
            $message .= "\nTanggal Request : " . $d_r . "\n";
            $message .= "\nKeterangan : " . $lap_kerusakan;

            $wa_by = $this->session->userdata('username');
            $translog_date_cus = date('Y-m-d H:i:s');
            $flag_status = '0';
            $flag_group = '1';

            $this->mmaster->wa1($id_wa, $mobile_number, $message, $wa_by, $flag_status, $translog_date_cus, $flag_group);

            $this->Logger->write('Simpan Data ' . $this->global['title'] . ' Kode : ' . $NewID);

            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
                $data = array(
                    'sukses' => false,
                );
                $this->load->view('pesan', $data);
            } else {
                $this->db->trans_commit();
                $NewID1 = str_replace("/", ".", $NewID);
                $data = array(
                    'sukses' => true,
                    'kode' => $NewID,
                    'folder' => $this->global['folder'] . '/cform/edit/' . $NewID1 . '/f/',
                );
                $this->load->view('pesan', $data);
            }
        }
    }

    public function edit()
    {

        $id_product = $this->uri->segment('4');
        $f_edit = $this->uri->segment('5');

        $csr_code = str_replace(".", "/", $id_product);

        if ($f_edit == 't') {
            $this->Logger->write('Membuka Menu Edit ' . $this->global['title'] . ' Kode :  ' . $id_product);
            $title = 'Edit ';
            $f_edit = true;
        } else {
            $this->Logger->write('Membuka Menu Data ' . $this->global['title']) . ' Kode : ' . $id_product;
            $title = 'Data ';
            $f_edit = false;
        }

        $isi = $this->mmaster->bacadetail($csr_code);
        $isi2 = $this->mmaster->bacadetail_cst($csr_code);

        $data = array(
            'folder' => $this->global['folder'],
            'title' => $title . $this->global['title'],
            'title_list' => 'Daftar ' . $this->global['title'],
            'f_edit' => $f_edit,
            'isi' => $isi['data'],
            'isi2' => $isi2,
            'data' => $this->mmaster->data_header($id_product)->row(),
            'data_kategori' => $this->mmaster->data_kategori(),
            'data_sub_kategori' => $this->mmaster->data_sub_kategori(),
            'data_karyawan' => $this->mmaster->data_karyawan(),
            'data_customers' => $this->mmaster->data_customers(),
            'data_barang' => $this->mmaster->data_barang(),
            'data_type_kerusakan' => $this->mmaster->data_type_kerusakan(),
        );

        $this->load->view($this->global['folder'] . '/vformedit', $data);
    }

    public function update()
    {
        $data = check_role($this->id_menu, 3);
        if (!$data) {
            redirect(base_url(), 'refresh');
        }

        $this->form_validation->set_rules('csr_code', 'CSR Code', 'trim');
        $this->form_validation->set_rules('id_customers', 'ID Customers', 'trim');
        $this->form_validation->set_rules('sts_pasang', 'Status Pasang', 'trim');
        $this->form_validation->set_rules('date_request', 'csr date', 'trim');
        $this->form_validation->set_rules('id_karyawan', 'ID Karyawan', 'trim');
        $this->form_validation->set_rules('lokasi', 'Lokasi', 'trim|required');
        $this->form_validation->set_rules('lap_kerusakan', 'Laporan Kerusakan', 'trim|required');


        if ($this->form_validation->run() == false) {
            $view_data = array(
                'sukses' => false,
            );
            $this->load->view('pesan', $view_data);
        } else {
            $csr_code = $this->input->post('csr_code');
            
            // Check if already approved
            $this->db->select('approved_csr_by');
            $this->db->where('csr_code', $csr_code);
            $check = $this->db->get('tb_afs_csr')->row();
            if ($check && $check->approved_csr_by != null) {
                $view_data = array(
                    'sukses' => false,
                    'message' => 'CSR sudah dikonfirmasi, tidak bisa diedit'
                );
                $this->load->view('pesan', $view_data);
                return;
            }

            $this->db->trans_begin();

            $csr_code = $this->input->post('csr_code');
            $customers = $this->input->post('customers');
            $sts_pasang = $this->input->post('sts_pasang');
            $csr_date = $this->input->post('csr_date');
            $id_karyawan = $this->input->post('id_karyawan');
            $lokasi = $this->input->post('lokasi');
            $lap_kerusakan = $this->input->post('lap_kerusakan');
            $link_foto = $this->input->post('link_foto');

            $link_foto = null;

            $this->load->library('upload');

            $config['upload_path'] = './assets/upload/afs/';
            $config['allowed_types'] = 'png|jpg|jpeg|bmp';
            $config['encrypt_name'] = true;
            $this->upload->initialize($config);

            if (!empty($_FILES['link_foto']['name'])) {
                if ($this->upload->do_upload('link_foto')) {
                    $gbr = $this->upload->data();
                    $link_foto = $gbr['file_name'];
                } else {
                    $error = $this->upload->display_errors();
                    echo "Upload gagal: " . $error;
                }
            }

            $this->mmaster->update($csr_code, $customers, $csr_date, $id_karyawan,   $lap_kerusakan, $lokasi, $sts_pasang, $link_foto);

            $query_log = $this->db->query("SELECT MAX(id_trans_swo_log) as maxKode FROM tb_trans_swo_log");
            $result2 = $query_log->row_array();
            $kodelog = $result2['maxKode'];
            $noUrut2 = $kodelog;
            $noUrut2++;
            $id_log =  $noUrut2++;

            $translog_date = date('Y-m-d H:i:s');
            $kode_trans = $csr_code;
            $user_log = $this->session->userdata('username');
            $action_log = 'Ubah CSR';
            $table_name = 'tb_afs_csr';
            $form_log = 'CSR';

            $this->mmaster->translog($id_log, $translog_date, $kode_trans, $user_log, $action_log, $table_name, $form_log);

            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
                echo json_encode(array(
                    'status' => false,
                    'message' => 'Gagal mengupdate data'
                ));
            } else {
                $this->db->trans_commit();
                $this->Logger->write('Update Data ' . $this->global['title'] . ' Kode : ' . $csr_code);
                echo json_encode(array(
                    'status' => true,
                    'message' => 'Data berhasil diupdate'
                ));
            }
        }
    }

    public function confirm()
    {
        $csr_code = $this->input->post('csr_code');
        $customer = $this->input->post('customer');
        $product = $this->input->post('product');

        $cst_input_date = date('Y-m-d H:i:s');
        $approved_csr_by = $this->session->userdata('username');
        $status = 'OUTSTANDING';

        // Get CSR date for validation
        $this->db->select('csr_date');
        $this->db->where('csr_code', $csr_code);
        $csr_query = $this->db->get('tb_afs_csr');
        $csr_data = $csr_query->row();
        
        if (!$csr_data) {
            echo json_encode(array(
                'status' => false, 
                'message' => 'Data CSR tidak ditemukan'
            ));
            return;
        }

        // Check if already approved
        $this->db->select('approved_csr_by');
        $this->db->where('csr_code', $csr_code);
        $check = $this->db->get('tb_afs_csr')->row();
        if ($check && $check->approved_csr_by != null) {
            echo json_encode(array(
                'status' => false, 
                'message' => 'CSR sudah dikonfirmasi'
            ));
            return;
        }

        // Ambil nomor urut terbesar dari tb_afs_cst 
        $query = $this->db->query("SELECT MAX(CAST(RIGHT(cst_code, 5) AS UNSIGNED)) as maxUrut FROM tb_afs_cst WHERE cst_code LIKE 'CST-EMM/%'");
        $row = $query->row();
        
        $maxUrut = $row->maxUrut;
        
        if ($maxUrut != null) {
            $noUrut3 = (int) $maxUrut;
            $noUrut3++;
        } else {
            $noUrut3 = 1;
        }


        $today = date("Y");
        $todayM = date("m");
        $todayD = date("d");
        $cst_date = $today . '-' . $todayM . '-' . $todayD;
        $cst_code = 'CST-EMM' . '/' . $today . '/' . $todayM . '/' . sprintf('%05s', $noUrut3);


        $this->mmaster->updateConfrimCSR($cst_code, $cst_date, $status, $approved_csr_by, $cst_input_date, $csr_code);

        $query_log = $this->db->query("SELECT MAX(id_trans_swo_log) as maxKode FROM tb_trans_swo_log");
        $result2 = $query_log->row_array();
        $kodelog = $result2['maxKode'];
        $noUrut2 = $kodelog;
        $noUrut2++;
        $id_log =  $noUrut2++;

        $translog_date = date('Y-m-d H:i:s');
        $kode_trans = $csr_code;
        $user_log = $this->session->userdata('username');
        $action_log = 'Confrim CSR';
        $table_name = 'tb_afs_csr';
        $form_log = 'CSR';

        $this->mmaster->translog($id_log, $translog_date, $kode_trans, $user_log, $action_log, $table_name, $form_log);

        $query_wa = $this->db->query("SELECT MAX(id_message_wa) as maxKode FROM tb_message_wa");
        $result3 = $query_wa->row_array();
        $kodewa = $result3['maxKode'];
        $noUrut3 = $kodewa;
        $noUrut3++;
        $id_wa =  $noUrut3++;

        $id_baru = sprintf('%05s', $noUrut3++);

        $this->db->where('id_customers', $customer);
        $query_wa = $this->db->get('m_customers');
        $tm_sql_wa = $query_wa->row_array();
        $nm_cs_wa = $tm_sql_wa['nm_customers'];
        $mobile_cust = $tm_sql_wa['customers_mobile'];

        $this->db->where('id_product', $product);
        $query_pr_code = $this->db->get('m_product');
        $tm_sql_pr = $query_pr_code->row_array();
        $nm_cs_cd = $tm_sql_pr['code_product'];
        $nm_cs_pr = $tm_sql_pr['nm_product'];

        // isi notif tiket
        $message_tic = "Bpk/Ibu " . $nm_cs_wa .
            "\nLaporan Anda  berkaitan dengan *mesin " . $nm_cs_cd . " " . $nm_cs_pr . "* sudah kami Terima dengan *ID Ticket Pelaporan #" . $id_baru . "* \nTim kami akan menindaklanjuti dan menginformasikan kepada Anda. \nIni adalah pesan otomatis. Harap tidak menjawab pesan ini";
        $wa_by = $this->session->userdata('username');
        $translog_date_cus = date('Y-m-d H:i:s');
        $flag_status = '0';
        $flag_group2 = '0';

        $this->mmaster->wa2($id_wa, $mobile_cust, $message_tic, $wa_by, $flag_status, $translog_date_cus, $flag_group2);
        
        $cst_code_dot = str_replace("/", ".", $cst_code);
        echo json_encode(array('status' => true, 'cst_code' => $cst_code_dot));
    }


    public function cancel()
    {
        $csr_code = $this->input->post('csr_code');
        $customer = $this->input->post('customer');
        $product = $this->input->post('product');
        $memo = $this->input->post('memo');

        $stat2 = 'CANCEL';
        $this->mmaster->updateCSRcancel($csr_code, $stat2, $memo);

        $query_log = $this->db->query("SELECT MAX(id_trans_swo_log) as maxKode FROM tb_trans_swo_log");
        $result2 = $query_log->row_array();
        $kodelog = $result2['maxKode'];
        $noUrut2 = $kodelog;
        $noUrut2++;
        $id_log =  $noUrut2++;

        $translog_date = date('Y-m-d H:i:s');
        $kode_trans = $csr_code;
        $user_log = $this->session->userdata('username');
        $action_log = 'Cancel CSR';
        $table_name = 'tb_afs_csr';
        $form_log = 'CSR';

        $this->mmaster->translog($id_log, $translog_date, $kode_trans, $user_log, $action_log, $table_name, $form_log);

        $query_wa = $this->db->query("SELECT MAX(id_message_wa) as maxKode FROM tb_message_wa");
        $result3 = $query_wa->row_array();
        $kodewa = $result3['maxKode'];
        $noUrut3 = $kodewa;
        $noUrut3++;
        $id_wa =  $noUrut3++;

        $wa_input = date('d-m-Y H:i:s');

        $this->db->where('id_customers', $customer);
        $query_wa = $this->db->get('m_customers');
        $tm_sql_wa = $query_wa->row_array();
        $nm_cs_wa = $tm_sql_wa['nm_customers'];

        $this->db->where('id_product', $product);
        $query_pr_code = $this->db->get('m_product');
        $tm_sql_pr = $query_pr_code->row_array();
        $nm_cs_pr = $tm_sql_pr['code_product'];

        $csr_by =  $this->session->userdata('username');
        $mobile_number = '62818777535-1541378496';
        $message = "Telah di CANCEL\n";
        $message .= "No CSR: $csr_code\n";
        $message .= "Customer: $nm_cs_wa\n";
        $message .= "Model mesin: $nm_cs_pr\n";
        $message .= "oleh $csr_by\n";
        $message .= "tanggal: $wa_input\n";
        $message .= "Alasan: $memo";

        // $message = "Telah di CANCEL\nNo CSR: " . $csr_code . "\nCustomer: " . $nm_cs_wa . "\nModel mesin: " . $nm_cs_pr . "\noleh " . $csr_by . " tanggal: " . $wa_input;
        $wa_by = $this->session->userdata('username');
        $translog_date_cus = date('Y-m-d H:i:s');
        $flag_status = '0';
        $flag_group = '1';

        $this->mmaster->wa1($id_wa, $mobile_number, $message, $wa_by, $flag_status, $translog_date_cus, $flag_group);

        echo json_encode(array('status' => true));
    }


    public function isi_otomatis()
    {
        $barcode = $this->input->post('barcode');

        $data = $this->mmaster->bacabarcode($barcode);

        $data = array(
            'so_code' => $data['code_so'] ?? null,
            'tgl_delivered' => $data['date_delivery'] ?? null,
            'do_code' => $data['code_do'] ?? null,
            'id_product' => $data['id_product'] ?? null,
            'status' => $data['status_do'] ?? null,
            'customers' => $data['id_customers'] ?? null,
            'mesin_lama' => $data['mesin_lama'] ?? null,
            'provinsi' => $data['provinsi'] ?? null,
            // 'so_oke' => $data ['so_oke']
        );

        echo json_encode($data);
    }

    public function requestcsr()
    {
        $data = check_role($this->id_menu, 1);
        if (!$data) {
            redirect(base_url(), 'refresh');
        }

        $search = $this->input->get('search');

        $start_date = $this->input->get('start_date');
        $end_date = $this->input->get('end_date');
        $all = $this->input->get('all');

        $isi = $this->mmaster->bacasemua($search, $start_date, $end_date, $all);

        $data = [
            'folder' => $this->global['folder'],
            'title' => $this->global['title'],
            'isi' => $isi['data'],
            'search' => $search,
        ];

        $this->Logger->write('Membuka Menu ' . $this->global['title']);

        $this->load->view($this->global['folder'] . '/mod_requestcsr', $data);
    }

    public function add_new_cst()
    {
        $csr_code = $this->input->post('csr_code');
        $new_code = $this->mmaster->add_new_cst($csr_code);
        if ($new_code) {
            $new_code_dot = str_replace("/", ".", $new_code);
            echo json_encode(array('status' => true, 'cst_code' => $new_code_dot));
        } else {
            echo json_encode(array('status' => false));
        }
    }
}

/* End of file Cform.php */