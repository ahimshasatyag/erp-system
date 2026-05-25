<?php

namespace App\Http\Resources\Menu;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SidebarResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'title' => $this->nm_menu,
            'path' => $this->nm_folder ?: null,
            'icon' => $this->nm_icon,
            'submenu' => $this->children && $this->children->isNotEmpty()
                ? $this->children->map(function ($child) {
                    return [
                        'title' => $child->nm_menu,
                        'path' => $child->nm_folder
                    ];
                })
                : null
        ];
    }
}
