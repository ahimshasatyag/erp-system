<?php

namespace App\Actions\purchaserequisitions;

use App\Models\purchaserequisitions\PurchaseRequisition;
use App\Enums\purchaserequisitions\PurchaseRequisitionStatusEnum;

class SubmitPurchaseRequisitionAction
{
    public function execute($idPr)
    {
        $pr = PurchaseRequisition::find($idPr);
        if (!$pr) {
            return false;
        }

        $pr->status_pr = PurchaseRequisitionStatusEnum::PR->value;
        $pr->save();

        return $pr;
    }
}
