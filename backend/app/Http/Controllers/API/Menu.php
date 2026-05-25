<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Menu\StoreMenuRequest;
use App\Http\Requests\Menu\UpdateMenuRequest;
use App\Http\Resources\Menu\MenuResource;
use App\Http\Resources\Menu\SidebarResource;
use App\Services\MenuService;
use App\Actions\Menu\GetSidebarMenuAction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class Menu extends Controller
{
    protected MenuService $menuService;

    public function __construct(MenuService $menuService)
    {
        $this->menuService = $menuService;
    }

    /**
     * Get sidebar menus for current logged-in user.
     */
    public function sidebar(Request $request, GetSidebarMenuAction $action): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $sidebarData = $action->execute($user);

        return response()->json(
            SidebarResource::collection($sidebarData)
        );
    }

    /**
     * CRUD: List all menus.
     */
    public function index(): JsonResponse
    {
        $menus = $this->menuService->listAll();
        return response()->json(
            MenuResource::collection($menus)
        );
    }

    /**
     * CRUD: Create a new menu.
     */
    public function store(StoreMenuRequest $request): JsonResponse
    {
        $menu = $this->menuService->store($request->validated());
        return response()->json([
            'message' => 'Menu created successfully',
            'data' => new MenuResource($menu)
        ], 201);
    }

    /**
     * CRUD: Show detail menu.
     */
    public function show(string $id): JsonResponse
    {
        $menu = $this->menuService->get($id);
        if (!$menu) {
            return response()->json(['message' => 'Menu not found'], 404);
        }
        return response()->json(new MenuResource($menu));
    }

    /**
     * CRUD: Update menu.
     */
    public function update(UpdateMenuRequest $request, string $id): JsonResponse
    {
        $menu = $this->menuService->updateMenu($id, $request->validated());
        if (!$menu) {
            return response()->json(['message' => 'Menu not found or failed to update'], 404);
        }
        return response()->json([
            'message' => 'Menu updated successfully',
            'data' => new MenuResource($menu)
        ]);
    }

    /**
     * CRUD: Delete menu.
     */
    public function destroy(string $id): JsonResponse
    {
        $deleted = $this->menuService->destroy($id);
        if (!$deleted) {
            return response()->json(['message' => 'Menu not found or failed to delete'], 404);
        }
        return response()->json(['message' => 'Menu deleted successfully']);
    }
}
