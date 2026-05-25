<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserLevel extends Model
{
    protected $table = 'm_users_level';
    protected $primaryKey = 'id_users_level';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_users_level',
        'nm_users_level',
        'date_create',
        'date_update',
        'id_dashboard',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'id_users_level', 'id_users_level');
    }
}
