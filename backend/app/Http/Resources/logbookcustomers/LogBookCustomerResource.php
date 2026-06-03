<?php

namespace App\Http\Resources\logbookcustomers;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogBookCustomerResource extends JsonResource
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
            'id_customers' => $this->id_customers,
            'nm_customers' => $this->nm_customers ?? null,
            'date_log_book' => $this->date_log_book,
            'masalah' => $this->masalah,
            'solusi' => $this->solusi,
            'catatan' => $this->catatan,
            'username' => $this->username,
            'nm_users' => $this->nm_users ?? null,
            'status_log_book' => $this->status_log_book,
            'date_create' => $this->date_create,
            'date_update' => $this->date_update,
        ];
    }
}
