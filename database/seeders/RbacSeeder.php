<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RbacSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('roles')->updateOrInsert(
            ['slug' => 'admin'],
            [
                'name' => 'Administrator',
                'description' => 'Full administrative access.',
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );

        DB::table('roles')->updateOrInsert(
            ['slug' => 'user'],
            [
                'name' => 'User',
                'description' => 'Standard registered user.',
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );

        $permissions = [
            [
                'name' => 'Manage users',
                'slug' => 'users.manage',
                'description' => 'Create, view, update, delete, and assign roles to users.',
            ],
            [
                'name' => 'Manage roles',
                'slug' => 'roles.manage',
                'description' => 'Create, view, update, and delete roles.',
            ],
            [
                'name' => 'Manage permissions',
                'slug' => 'permissions.manage',
                'description' => 'Create, view, update, and delete permissions.',
            ],
        ];

        foreach ($permissions as $permission) {
            DB::table('permissions')->updateOrInsert(
                ['slug' => $permission['slug']],
                [
                    'name' => $permission['name'],
                    'description' => $permission['description'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }

        $adminRoleId = DB::table('roles')->where('slug', 'admin')->value('id');
        $permissionIds = DB::table('permissions')
            ->whereIn('slug', [
                'users.manage',
                'roles.manage',
                'permissions.manage',
            ])
            ->pluck('id');

        DB::table('role_permissions')->where('role_id', $adminRoleId)->delete();

        $rows = $permissionIds->map(fn ($permissionId): array => [
            'role_id' => $adminRoleId,
            'permission_id' => $permissionId,
            'created_at' => $now,
            'updated_at' => $now,
        ])->all();

        DB::table('role_permissions')->insert($rows);
    }
}
