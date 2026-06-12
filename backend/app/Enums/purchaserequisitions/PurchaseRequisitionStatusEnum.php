<?php

namespace App\Enums\purchaserequisitions;

enum PurchaseRequisitionStatusEnum: string
{
    case DRAFT = 'DRAFT';
    case PR = 'PR';
    case QUOTATION = 'QUOTATION';
    case CANCELED = 'CANCELED';

    public function label(): string
    {
        return match($this) {
            self::DRAFT => 'Draft',
            self::PR => 'Purchase Requisition',
            self::QUOTATION => 'Quotation',
            self::CANCELED => 'Canceled',
        };
    }
}
