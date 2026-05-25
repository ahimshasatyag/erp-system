<?php

namespace App\Http\Requests\Menu;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nm_menu' => 'sometimes|required|string|max:100',
            'id_parent' => 'nullable|string|max:30|exists:m_menu,id_menu',
            'no_urut' => 'nullable|integer',
            'nm_folder' => 'nullable|string|max:100',
            'nm_icon' => 'nullable|string|max:100',
        ];
    }
}
