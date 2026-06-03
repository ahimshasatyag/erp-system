<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Cform extends CI_Controller
{

    public $global = array();
    public $id_menu = '10602';

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
        $data = array(
            'folder' => $this->global['folder'],
            'title' => $this->global['title'],
        );

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
            'data_customers' => $this->mmaster->data_customers(),

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

        $this->form_validation->set_rules('id_customers', 'id_customers', 'trim|required');
        $this->form_validation->set_rules('date_log_book', 'date_log_book', 'trim|required');
        if ($this->form_validation->run() == false) {
            $data = array(
                'sukses' => false,
            );
            $this->load->view('pesan', $data);
        } else {
            $this->db->trans_begin();
            $id_customers = $this->input->post('id_customers');
            $date_log_book = date("Y-m-d", strtotime($this->input->post('date_log_book')));
            $masalah = htmlspecialchars($this->input->post('masalah_hidden'));
            $solusi = htmlspecialchars($this->input->post('solusi_hidden'));
            $catatan = htmlspecialchars($this->input->post('catatan_hidden'));
            $username = $this->session->userdata('username');

            $id_log_book = $this->mmaster->insert($id_customers, $date_log_book, $masalah, $solusi, $catatan, $username);

            $this->Logger->write('Simpan Data ' . $this->global['title'] . ' Kode : ' . $id_log_book);

            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
                $data = array(
                    'sukses' => false,
                );
                $this->load->view('pesan', $data);
            } else {
                $this->db->trans_commit();
                $data = array(
                    'sukses' => true,
                    'kode' => $id_log_book,
                    'folder' => $this->global['folder'] . '/cform/edit/' . $id_log_book . '/f/',
                );
                $this->load->view('pesan', $data);
            }
        }
    }

    public function edit()
    {

        $id_log_book = $this->uri->segment('4');
        $f_edit = $this->uri->segment('5');

        if ($f_edit == 't') {
            $this->Logger->write('Membuka Menu Edit ' . $this->global['title'] . ' Kode :  ' . $id_log_book);
            $title = 'Edit ';
            $f_edit = true;
        } else {
            $this->Logger->write('Membuka Menu Data ' . $this->global['title']) . ' Kode : ' . $id_log_book;
            $title = 'Data ';
            $f_edit = false;
        }

        $data = array(
            'folder' => $this->global['folder'],
            'title' => $title . $this->global['title'],
            'title_list' => 'Daftar ' . $this->global['title'],
            'f_edit' => $f_edit,
            'data' => $this->mmaster->data_header($id_log_book)->row(),
            'data_customers' => $this->mmaster->data_customers(),
        );

        $this->load->view($this->global['folder'] . '/vformedit', $data);
    }

    public function update()
    {
        $data = check_role($this->id_menu, 3);
        if (!$data) {
            redirect(base_url(), 'refresh');
        }

        $this->form_validation->set_rules('id_log_book', 'id_log_book', 'trim|required');
        $this->form_validation->set_rules('id_customers', 'id_customers', 'trim|required');
        $this->form_validation->set_rules('date_log_book', 'date_log_book', 'trim|required');

        if ($this->form_validation->run() == false) {
            $data = array(
                'sukses' => false,
            );
            $this->load->view('pesan', $data);
        } else {
            $this->db->trans_begin();
            $id_log_book = $this->input->post('id_log_book');
            $id_customers = $this->input->post('id_customers');
            $date_log_book = date("Y-m-d", strtotime($this->input->post('date_log_book')));
            $masalah = htmlspecialchars($this->input->post('masalah_hidden'));
            $solusi = htmlspecialchars($this->input->post('solusi_hidden'));
            $catatan = htmlspecialchars($this->input->post('catatan_hidden'));
            $username = $this->session->userdata('username');

            $this->mmaster->update($id_log_book, $id_customers, $date_log_book, $masalah, $solusi, $catatan, $username);

            $this->Logger->write('Update Data ' . $this->global['title'] . ' Kode : ' . $id_log_book);

            if ($this->db->trans_status() === false) {
                $this->db->trans_rollback();
                $data = array(
                    'sukses' => false,
                );
                $this->load->view('pesan', $data);
            } else {
                $this->db->trans_commit();
                $data = array(
                    'sukses' => true,
                    'kode' => $id_log_book,
                    'folder' => $this->global['folder'] . '/cform/edit/' . $id_log_book . '/f/',
                );
                $this->load->view('pesan', $data);
            }
        }
    }

    public function delete()
    {
        $data = check_role($this->id_menu, 4);
        if (!$data) {
            redirect(base_url(), 'refresh');
        }
        $this->db->trans_begin();

        $id_log_book = $this->input->post('id_log_book');

        $this->mmaster->delete($id_log_book);

        $this->Logger->write('Hapus Data ' . $this->global['title'] . ' Kode : ' . $id_log_book);

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();

        } else {
            $this->db->trans_commit();

        }
    }

    public function upload_gambar()
    {
        if (isset($_FILES['upload']['name'])) {
            $file = $_FILES['upload']['tmp_name'];
            $file_name = $_FILES['upload']['name'];
            $file_name_array = explode(".", $file_name);
            $extension = end($file_name_array);

            $new_image_name = time() . rand() . '.' . $extension;
            chmod('assets/images/upload/', 0777);
            $allowed_extension = array("jpg", "gif", "png");
            if (in_array($extension, $allowed_extension)) {
                move_uploaded_file($file, 'assets/images/upload/' . $new_image_name);
                $function_number = $_GET['CKEditorFuncNum'];
                $url = 'assets/images/upload/' . $new_image_name;
                $message = '';
                echo "<script type='text/javascript'>window.parent.CKEDITOR.tools.callFunction($function_number, '$url', '$message');</script>";
            }
        }
    }

}

/* End of file Cform.php */