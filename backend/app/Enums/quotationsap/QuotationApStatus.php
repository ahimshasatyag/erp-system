<?php

namespace App\Enums\quotationsap;

enum QuotationApStatus: string
{
    case DRAFT = 'DRAFT';
    case QUOTATION = 'QUOTATION';
    case CANCEL = 'CANCEL';
    case PO_PURCHASE = 'PO PURCHASE';
}
