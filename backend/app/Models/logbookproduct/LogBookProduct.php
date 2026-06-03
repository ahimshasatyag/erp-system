<?php

namespace App\Models\logbookproduct;

use App\Traits\logbookproduct\LogBookProductTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\logbookproduct\LogBookStatus;
use App\Models\products\Product;
use App\Models\TypeKerusakan;
use App\Models\User;

class LogBookProduct extends Model
{
    use HasFactory, LogBookProductTrait;

    protected $table = 'tb_log_book_product';
    protected $primaryKey = 'id_log_book';
    public $timestamps = false; // We use custom date_create, date_update

    protected $fillable = [
        'id_product',
        'id_type_kerusakan',
        'date_log_book',
        'masalah',
        'solusi',
        'catatan',
        'username',
        'status_log_book',
        'date_create',
        'date_update',
    ];

    protected $casts = [
        'date_log_book' => 'date',
        'date_create' => 'datetime',
        'date_update' => 'datetime',
        'status_log_book' => LogBookStatus::class,
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'id_product', 'id_product');
    }

    public function typeKerusakan()
    {
        return $this->belongsTo(TypeKerusakan::class, 'id_type_kerusakan', 'id_type_kerusakan');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'username', 'username');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->date_create = $model->freshTimestamp();
            if (!$model->status_log_book) {
                $model->status_log_book = LogBookStatus::LOG_BOOK;
            }
        });

        static::updating(function ($model) {
            $model->date_update = $model->freshTimestamp();
        });
    }
}
