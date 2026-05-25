<?php

namespace App\Enums\Menu;

enum MenuTypeEnum: string
{
    case PARENT = 'parent';
    case MENU = 'menu';
    case SUBMENU = 'submenu';
}
