<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class MenuAccessMiddleware
{
    /**
     * Handle an incoming request.
     * Powers: Create=1, Read=2, Update=3, Delete=4
     */
    public function handle(Request $request, Closure $next, string $menuId, string $power = 'Read'): Response
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $powerMap = [
            'Create' => 1,
            'Read' => 2,
            'Update' => 3,
            'Delete' => 4,
        ];

        $powerId = is_numeric($power) ? (int)$power : ($powerMap[$power] ?? 2);

        if (!$user->hasMenuAccess($menuId, $powerId)) {
            return response()->json([
                'message' => 'You do not have access to this menu'
            ], 403);
        }

        return $next($request);
    }
}
