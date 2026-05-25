<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\Menu\HasMenuAccess;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasMenuAccess;

    protected $table = 'm_users';

    const CREATED_AT = 'date_create';
    const UPDATED_AT = 'date_update';

    protected $fillable = [
        'username',
        'password',
        'nm_users',
        'id_users_level',
        'is_active',
        'id_karyawan',
        'link_foto',
        'phone',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'refresh_token',
        'hris_token',
    ];

    protected $appends = ['name', 'email'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'integer',
        ];
    }

    public function getNameAttribute(): ?string
    {
        return $this->nm_users;
    }

    public function getEmailAttribute(): ?string
    {
        return $this->username;
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(UserLevel::class, 'id_users_level', 'id_users_level');
    }
}
