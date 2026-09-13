import { useState } from 'react';
import type { FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import FlashMessages from '@/components/admin/flash-messages';
import Pagination from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Paginated, PermissionRecord } from '@/types/rbac';

type Props = {
    permissions: Paginated<PermissionRecord>;
    protectedPermissions: string[];
    filters: {
        search: string;
    };
};

export default function PermissionsIndex({
                                             permissions,
                                             protectedPermissions,
                                             filters,
                                         }: Props) {
    const [search, setSearch] = useState(filters.search);

    function filter(event: FormEvent) {
        event.preventDefault();
        router.get('/admin/permissions', { search }, { preserveState: true, replace: true });
    }

    function remove(permission: PermissionRecord) {
        if (!window.confirm(`Delete permission “${permission.name}”?`)) {
            return;
        }

        router.delete(`/admin/permissions/${permission.id}`, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Permissions', href: '/admin/permissions' }]}>
            <Head title="Permissions" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Permissions</h1>
                        <p className="text-sm text-muted-foreground">
                            Keep permissions small and action-based.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/admin/permissions/create">
                            <Plus className="size-4" />
                            Add permission
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
                                <th className="px-4 py-3 font-medium">Permission</th>
                                <th className="px-4 py-3 font-medium">Roles</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {permissions.data.map((permission) => {
                                const protectedPermission = protectedPermissions.includes(
                                    permission.slug,
                                );

                                return (
                                    <tr key={permission.id} className="hover:bg-muted/30">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{permission.name}</span>
                                                {protectedPermission && (
                                                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs">
                                                            Required
                                                        </span>
                                                )}
                                            </div>
                                            <div className="font-mono text-xs text-muted-foreground">
                                                {permission.slug}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{permission.roles_count ?? 0}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button asChild size="sm" variant="outline">
                                                    <Link href={`/admin/permissions/${permission.id}/edit`}>
                                                        <Pencil className="size-4" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                {!protectedPermission && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => remove(permission)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                        Delete
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {permissions.data.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">
                                        No permissions found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={permissions.links}
                        from={permissions.from}
                        to={permissions.to}
                        total={permissions.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
