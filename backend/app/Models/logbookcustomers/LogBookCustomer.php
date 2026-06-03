<?php

namespace App\Models\logbookcustomers;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogBookCustomer extends Model
{
    use HasFactory;

    protected $table = 'tb_log_book_customers';
    protected $primaryKey = 'id_log_book';
    
    const CREATED_AT = 'date_create';
    const UPDATED_AT = 'date_update';

    protected $fillable = [
        'id_customers',
        'date_log_book',
        'masalah',
        'solusi',
        'catatan',
        'username',
        'status_log_book'
    ];

    /**
     * Relationship to Customer (m_customers)
     * Assuming the customer model is named Customer, we will just use DB join in repository for now or map it if it exists.
     */
}
