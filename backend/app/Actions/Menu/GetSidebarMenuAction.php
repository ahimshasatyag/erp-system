<?php

namespace App\Actions\Menu;

use App\Services\MenuService;
use Illuminate\Support\Collection;

class GetSidebarMenuAction
{
    protected MenuService $menuService;

    public function __construct(MenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    public function execute($user): Collection
    {
        return $this->menuService->getSidebarForUser($user);
    }
}
