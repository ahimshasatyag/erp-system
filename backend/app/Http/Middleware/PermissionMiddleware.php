<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\DB;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Super Admin gets direct pass-through
        if ($user->id_users_level === 1) {
            return $next($request);
        }

        $powerMap = [
            'Create' => 1,
            'Read' => 2,
            'Update' => 3,
            'Delete' => 4,
        ];
        $powerId = $powerMap[$permission] ?? null;

        if ($powerId) {
            $hasPower = DB::table('m_users_role')
                ->where('id_users_level', $user->id_users_level)
                ->where('id_users_power', $powerId)
                ->exists();

            if (!$hasPower) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
        }

        return $next($request);
    }
}
