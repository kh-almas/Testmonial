import { useState } from 'react';
import type { FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import FlashMessages from '@/components/admin/flash-messages';
import Pagination from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Paginated, RoleRecord } from '@/types/rbac';

type Props = {
    roles: Paginated<RoleRecord>;
    filters: {
        search: string;
    };
};

export default function RolesIndex({ roles, filters }: Props) {
    const [search, setSearch] = useState(filters.search);

    function filter(event: FormEvent) {
        event.preventDefault();
        router.get('/admin/roles', { search }, { preserveState: true, replace: true });
    }

    function remove(role: RoleRecord) {
        if (!window.confirm(`Delete role “${role.name}”?`)) {
            return;
        }

        router.delete(`/admin/roles/${role.id}`, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Roles', href: '/admin/roles' }]}>
            <Head title="Roles" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
                        <p className="text-sm text-muted-foreground">
                            Create roles and select their permissions.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/admin/roles/create">
                            <Plus className="size-4" />
                            Add role
                        </Link>
                    </Button>
                </div>

                <FlashMessages />

                <form onSubmit={filter} className="flex gap-2 rounded-xl border bg-card p-4 shadow-sm">
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search name or slug"
                        className="max-w-md"
                    />
                    <Button type="submit">Search</Button>
                </form>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">Users</th>
                                <th className="px-4 py-3 font-medium">Permissions</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {roles.data.map((role) => (
                                <tr key={role.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{role.name}</div>
                                        <div className="font-mono text-xs text-muted-foreground">
                                            {role.slug}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{role.users_count ?? 0}</td>
                                    <td className="px-4 py-3">{role.permissions_count ?? 0}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/admin/roles/${role.id}/edit`}>
                                                    <Pencil className="size-4" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            {role.slug !== 'admin' && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => remove(role)}
                                                >
                                                    <Trash2 className="size-4" />
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {roles.data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                                        No roles found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={roles.links}
                        from={roles.from}
                        to={roles.to}
                        total={roles.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
