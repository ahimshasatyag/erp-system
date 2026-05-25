<?php

namespace App\Services;

use App\Repositories\MenuRepository;
use App\Models\Menu;
use Illuminate\Support\Collection;

class MenuService
{
    protected MenuRepository $menuRepository;

    public function __construct(MenuRepository $menuRepository)
    {
        $this->menuRepository = $menuRepository;
    }

    public function listAll(): Collection
    {
        return $this->menuRepository->getAll();
    }

    public function get(string $id): ?Menu
    {
        return $this->menuRepository->getById($id);
    }

    public function store(array $data): Menu
    {
        return $this->menuRepository->create($data);
    }

    public function updateMenu(string $id, array $data): ?Menu
    {
        $menu = $this->menuRepository->getById($id);
        if (!$menu) {
            return null;
        }
        return $this->menuRepository->update($menu, $data);
    }

    public function destroy(string $id): bool
    {
        $menu = $this->menuRepository->getById($id);
        if (!$menu) {
            return false;
        }
        return $this->menuRepository->delete($menu);
    }

    public function getSidebarForUser($user): Collection
    {
        $accessibleIds = $user->getAccessibleMenuIds();
        return $this->menuRepository->getAccessibleSidebarMenus($accessibleIds);
    }
}
