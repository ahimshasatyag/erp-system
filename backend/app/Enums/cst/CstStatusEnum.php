<?php

namespace App\Enums\cst;

enum CstStatusEnum: string
{
    case OUTSTANDING = 'OUTSTANDING';
    case ON_PROGRESS = 'ON PROGRESS';
    case DONE = 'DONE';
    case CANCEL = 'CANCEL';
    case PENDING = 'PENDING';
}
