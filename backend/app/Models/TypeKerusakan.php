<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeKerusakan extends Model
{
    use HasFactory;

    protected $table = 'm_type_kerusakan';
    protected $primaryKey = 'id_type_kerusakan';
    public $timestamps = false;

    protected $fillable = [
        // Add fillable columns based on the m_type_kerusakan table schema
    ];
}
