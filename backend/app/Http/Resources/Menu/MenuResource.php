<?php

namespace App\Http\Resources\Menu;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id_menu' => $this->id_menu,
            'nm_menu' => $this->nm_menu,
            'id_parent' => $this->id_parent,
            'no_urut' => $this->no_urut,
            'nm_folder' => $this->nm_folder,
            'nm_icon' => $this->nm_icon,
            'children' => MenuResource::collection($this->whenLoaded('children')),
        ];
    }
}
