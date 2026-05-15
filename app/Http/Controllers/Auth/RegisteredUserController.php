<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Tenant;
use App\Models\Branch;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $tenantId = str()->slug($request->name) . '-' . str()->random(4);
        
        $tenant = Tenant::create([
            'id' => $tenantId,
            'name' => $request->name . "'s Center",
        ]);

        // Optional: Create a domain if needed, but for single-db we don't strictly need it per user unless we use subdomains
        // $tenant->domains()->create(['domain' => $tenantId . '.localhost']);

        $user = User::create([
            'tenant_id' => $tenantId,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Create default branch
        $branch = Branch::create([
            'tenant_id' => $tenantId,
            'name' => 'Main Branch',
            'location' => 'Default Location',
        ]);

        $user->update(['current_branch_id' => $branch->id]);
        $user->branches()->attach($branch->id, ['tenant_id' => $tenantId]);

        // Initialize RBAC for new tenant
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        app(\Spatie\Permission\PermissionRegistrar::class)->setPermissionsTeamId($tenantId);
        
        $adminRole = \Spatie\Permission\Models\Role::create([
            'name' => 'admin', 
            'tenant_id' => $tenantId,
            'guard_name' => 'web'
        ]);

        \Spatie\Permission\Models\Role::create([
            'name' => 'branch_manager', 
            'tenant_id' => $tenantId,
            'guard_name' => 'web'
        ]);

        \Spatie\Permission\Models\Role::create([
            'name' => 'receptionist', 
            'tenant_id' => $tenantId,
            'guard_name' => 'web'
        ]);

        // Assign all available permissions to the initial tenant admin
        $adminRole->syncPermissions(\Spatie\Permission\Models\Permission::all());
        
        $user->assignRole($adminRole);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
