<?php

namespace App\Enums\csr;

enum CsrStatusEnum: string
{
    case DRAFT = 'DRAFT';
    case OUTSTANDING = 'OUTSTANDING';
    case IN_PROGRESS = 'IN PROGRESS';
    case CANCEL = 'CANCEL';
}
