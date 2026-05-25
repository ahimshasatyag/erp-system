<?php

namespace App\Repositories;

use App\Models\Menu;
use Illuminate\Support\Collection;

class MenuRepository
{
    public function getAll(): Collection
    {
        return Menu::orderBy('no_urut')->get();
    }

    public function getById(string $id): ?Menu
    {
        return Menu::find($id);
    }

    public function create(array $data): Menu
    {
        return Menu::create($data);
    }

    public function update(Menu $menu, array $data): Menu
    {
        $menu->update($data);
        return $menu;
    }

    public function delete(Menu $menu): bool
    {
        return $menu->delete();
    }

    public function getAccessibleSidebarMenus(array $accessibleIds): Collection
    {
        return Menu::whereIn('id_parent', ['0', '', null])
            ->whereIn('id_menu', $accessibleIds)
            ->with(['children' => function ($query) use ($accessibleIds) {
                $query->whereIn('id_menu', $accessibleIds)->orderBy('no_urut');
            }])
            ->orderBy('no_urut')
            ->get();
    }
}
