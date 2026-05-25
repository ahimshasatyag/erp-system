<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddlewareRoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Super Admin (level = 1) is always allowed
        if ($user->id_users_level === 1) {
            return $next($request);
        }

        $userLevelName = $user->level?->nm_users_level;

        if ($userLevelName && in_array($userLevelName, $roles)) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Your role does not have access to this resource'
        ], 403);
    }
}
