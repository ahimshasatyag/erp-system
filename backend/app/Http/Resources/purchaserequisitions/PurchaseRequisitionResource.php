<?php

namespace App\Http\Resources\purchaserequisitions;

use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseRequisitionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id_pr' => $this->id_pr,
            'code_pr' => $this->code_pr,
            'username' => $this->username,
            'date_request' => $this->date_request,
            'date_deadline' => $this->date_deadline,
            'status_pr' => $this->status_pr,
            'details' => $this->whenLoaded('details'),
        ];
    }
}
