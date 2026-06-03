<?php

namespace App\Services\cekserialnumber;

use App\Actions\cekserialnumber\GetListSerialNumberAction;
use App\Actions\cekserialnumber\GetDetailSerialNumberAction;
use App\Actions\cekserialnumber\GetHistorySerialNumberAction;

class CekSerialNumberService
{
    public function __construct(
        protected GetListSerialNumberAction $getListAction,
        protected GetDetailSerialNumberAction $getDetailAction,
        protected GetHistorySerialNumberAction $getHistoryAction
    ) {}

    public function getList(string $search = null)
    {
        return $this->getListAction->execute($search);
    }

    public function getDetail(string $barcode)
    {
        $detail = $this->getDetailAction->execute($barcode);
        $history = $this->getHistoryAction->execute($barcode);

        return [
            'detail' => $detail,
            'history' => $history
        ];
    }
}
