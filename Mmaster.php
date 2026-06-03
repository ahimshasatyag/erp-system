<?php

defined('BASEPATH') or exit('No direct script access allowed');
use Ozdemir\Datatables\Datatables;
use Ozdemir\Datatables\DB\CodeigniterAdapter;

class Mmaster extends CI_Model
{
    public function data($i_menu, $folder)
    {
        $datatables = new Datatables(new CodeigniterAdapter);
        $datatables->query("select a.id_log_book, b.nm_customers, c.nm_users, a.date_log_book,
        '$folder' as folder
        from tb_log_book_customers a, m_customers b, m_users c
        where a.id_customers = b.id_customers
        and a.username = c.username and a.status_log_book = 'Log Book' ");
        $datatables->hide('folder');
        $datatables->hide('id_log_book');

        $datatables->edit('nm_customers', function ($data) {
            $id_log_book = $data['id_log_book'];
            $nm_customers = $data['nm_customers'];
            $folder = $data['folder'];

            $hasil = "<a href=\"#\" onclick='show(\"$folder/cform/edit/$id_log_book/f\",\"#main\"); return false;'>$nm_customers</a>";
            return $hasil;
        });

        $datatables->edit('date_log_book', function ($data) {
            return date("d-m-Y", strtotime($data['date_log_book']));
        });

        return $datatables->generate();
    }

    public function insert($id_customers, $date_log_book, $masalah, $solusi, $catatan, $username)
    {

        $data = array(
            'id_customers' => $id_customers,
            'date_log_book' => $date_log_book,
            'masalah' => $masalah,
            'solusi' => $solusi,
            'catatan' => $catatan,
            'username' => $username,
            'date_create' => current_datetime(),
            'status_log_book' => 'Log Book',
        );

        $this->db->insert('tb_log_book_customers', $data);
        $insert_id = $this->db->insert_id();

        return $insert_id;

    }

    public function update($id_log_book, $id_customers, $date_log_book, $masalah, $solusi, $catatan, $username)
    {
        $data = array(
            'id_customers' => $id_customers,
            'date_log_book' => $date_log_book,
            'masalah' => $masalah,
            'solusi' => $solusi,
            'catatan' => $catatan,
            'date_update' => current_datetime(),
        );

        $this->db->where('id_log_book', $id_log_book);
        $this->db->update('tb_log_book_customers', $data);
    }

    public function delete($id_log_book)
    {
        $data = array(
            'date_create' => current_datetime(),
            'status_log_book' => 'CANCELED',
        );

        $this->db->where('id_log_book', $id_log_book);
        $this->db->update('tb_log_book_customers', $data);
    }

    public function data_customers()
    {
        return $this->db->get('m_customers');
    }

    public function data_header($id_log_book)
    {
        return $this->db->query("select * from tb_log_book_customers where id_log_book = '$id_log_book'");
    }

}

/* End of file Mmaster.php */