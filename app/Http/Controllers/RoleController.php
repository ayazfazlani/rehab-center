<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('manage-roles');

        $roles = Role::where('tenant_id', $request->user()->tenant_id)
            ->with('permissions')
            ->get();
        $permissions = Permission::all();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'required|array',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'tenant_id' => $request->user()->tenant_id,
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($request->permissions);
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        return redirect()->back();
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'required|array',
        ]);

        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions);
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        return redirect()->back();
    }

    public function destroy(Role $role)
    {
        // Don't delete protected roles
        if (in_array($role->name, ['admin', 'super-admin'])) {
            return redirect()->back()->withErrors(['error' => 'Protected roles cannot be deleted.']);
        }

        $role->delete();
        return redirect()->back();
    }
}
