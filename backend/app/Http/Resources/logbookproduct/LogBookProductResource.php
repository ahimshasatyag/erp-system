<?php

namespace App\Http\Resources\logbookproduct;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogBookProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id_log_book' => $this->id_log_book,
            'id_product' => $this->id_product,
            'id_type_kerusakan' => $this->id_type_kerusakan,
            'date_log_book' => $this->date_log_book ? $this->date_log_book->format('Y-m-d') : null,
            'masalah' => $this->masalah,
            'solusi' => $this->solusi,
            'catatan' => $this->catatan,
            'status_log_book' => $this->status_log_book,
            'user' => [
                'username' => $this->user->username ?? $this->username,
                'nm_users' => $this->user->nm_users ?? null,
            ],
            'product' => [
                'code_product' => $this->product->code_product ?? null,
                'nm_product' => $this->product->nm_product ?? null,
            ],
            'type_kerusakan' => [
                // Add relevant fields based on m_type_kerusakan
            ],
            'created_at' => $this->date_create ? $this->date_create->toIso8601String() : null,
            'updated_at' => $this->date_update ? $this->date_update->toIso8601String() : null,
        ];
    }
}
