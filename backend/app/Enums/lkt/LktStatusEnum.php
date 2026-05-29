<?php

namespace App\Enums\lkt;

enum LktStatusEnum: string
{
    case DRAFT = 'DRAFT';
    case ON_PROGRESS = 'ON PROGRESS';
    case DONE = 'DONE';
    case CANCEL = 'CANCEL';
}
