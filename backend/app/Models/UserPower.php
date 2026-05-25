<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPower extends Model
{
    protected $table = 'm_users_power';
    protected $primaryKey = 'id_users_power';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_users_power',
        'nm_users_power',
    ];
}
