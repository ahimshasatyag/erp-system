<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoleMenu extends Model
{
    protected $table = 'm_users_role';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_menu',
        'id_users_level',
        'id_users_power',
    ];

    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'id_menu', 'id_menu');
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(UserLevel::class, 'id_users_level', 'id_users_level');
    }

    public function power(): BelongsTo
    {
        return $this->belongsTo(UserPower::class, 'id_users_power', 'id_users_power');
    }
}
