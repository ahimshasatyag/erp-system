<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Menu extends Model
{
    protected $table = 'm_menu';
    protected $primaryKey = 'id_menu';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id_menu',
        'nm_menu',
        'id_parent',
        'no_urut',
        'nm_folder',
        'nm_icon',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'id_parent', 'id_menu');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Menu::class, 'id_parent', 'id_menu')->orderBy('no_urut');
    }

    public function roles(): HasMany
    {
        return $this->hasMany(RoleMenu::class, 'id_menu', 'id_menu');
    }
}
