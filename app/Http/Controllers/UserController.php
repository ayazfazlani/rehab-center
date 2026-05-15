<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('manage-users');

        $users = User::with(['roles', 'branches'])
            ->where('tenant_id', $request->user()->tenant_id)
            ->paginate(10);

        $roles = Role::where('tenant_id', $request->user()->tenant_id)->get();
        $branches = Branch::where('tenant_id', $request->user()->tenant_id)->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'branches' => $branches,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'roles' => 'required|array',
            'branches' => 'required|array',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'tenant_id' => $request->user()->tenant_id,
            'current_branch_id' => $request->branches[0] ?? null,
        ]);

        $user->assignRole($request->roles);
        
        $branchData = collect($request->branches)->mapWithKeys(function($id) use ($user) {
            return [$id => ['tenant_id' => $user->tenant_id]];
        });
        
        $user->branches()->sync($branchData);

        return redirect()->back();
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,'.$user->id,
            'roles' => 'required|array',
            'branches' => 'required|array',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        $user->syncRoles($request->roles);
        
        $branchData = collect($request->branches)->mapWithKeys(function($id) use ($user) {
            return [$id => ['tenant_id' => $user->tenant_id]];
        });
        
        $user->branches()->sync($branchData);

        return redirect()->back();
    }

    public function destroy(User $user)
    {
        // Don't delete self
        if (auth()->id() === $user->id) {
            return redirect()->back()->withErrors(['error' => 'You cannot delete yourself.']);
        }

        $user->delete();
        return redirect()->back();
    }
}
