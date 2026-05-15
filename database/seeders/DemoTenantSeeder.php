<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DemoTenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Tenant
        $tenant = \App\Models\Tenant::create([
            'id' => 'demo-center',
            'name' => 'Demo Rehab Center',
        ]);

        // Create Domain
        $tenant->domains()->create([
            'domain' => 'center1.localhost',
        ]);

        // Create Admin User
        $user = \App\Models\User::create([
            'tenant_id' => 'demo-center',
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        // Setup Roles (Scoped to Tenant)
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();
        app(\Spatie\Permission\PermissionRegistrar::class)->setPermissionsTeamId($tenant->id);
        
        $adminRole = \Spatie\Permission\Models\Role::create(['name' => 'admin', 'tenant_id' => $tenant->id]);
        $branchManagerRole = \Spatie\Permission\Models\Role::create(['name' => 'branch_manager', 'tenant_id' => $tenant->id]);
        $receptionistRole = \Spatie\Permission\Models\Role::create(['name' => 'receptionist', 'tenant_id' => $tenant->id]);

        // Sync all permissions to admin
        $adminRole->syncPermissions(\Spatie\Permission\Models\Permission::all());

        $user->assignRole($adminRole);

        // Create Branches
        $branch1 = \App\Models\Branch::create([
            'tenant_id' => 'demo-center',
            'name' => 'Main Center Branch',
            'location' => 'Downtown',
        ]);

        $branch2 = \App\Models\Branch::create([
            'tenant_id' => 'demo-center',
            'name' => 'North Wing Clinic',
            'location' => 'Northside',
        ]);

        // Assign user to main branch
        $user->update(['current_branch_id' => $branch1->id]);
        $user->branches()->attach([
            $branch1->id => ['tenant_id' => 'demo-center'],
            $branch2->id => ['tenant_id' => 'demo-center'],
        ]);
    }
}
