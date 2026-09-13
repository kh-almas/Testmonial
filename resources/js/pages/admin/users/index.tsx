import { useState } from 'react';
import type { FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import FlashMessages from '@/components/admin/flash-messages';
import Pagination from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Paginated, UserRecord } from '@/types/rbac';

type Props = {
    users: Paginated<UserRecord>;
    filters: {
        search: string;
    };
};

export default function UsersIndex({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search);

    function filter(event: FormEvent) {
        event.preventDefault();
        router.get('/admin/users', { search }, { preserveState: true, replace: true });
    }

    function remove(user: UserRecord) {
        if (!window.confirm(`Delete ${user.name}?`)) {
            return;
        }

        router.delete(`/admin/users/${user.id}`, { preserveScroll: true });
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: '/admin/users' }]}>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage Laravel users and their roles.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/admin/users/create">
                            <Plus className="size-4" />
                            Add user
                        </Link>
                    </Button>
                </div>

                <FlashMessages />

                <form onSubmit={filter} className="flex gap-2 rounded-xl border bg-card p-4 shadow-sm">
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search name or email"
                        className="max-w-md"
                    />
                    <Button type="submit">Search</Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setSearch('');
                            router.get('/admin/users', {}, { replace: true });
                        }}
                    >
                        Clear
                    </Button>
                </form>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted/50 text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Roles</th>
                                <th className="px-4 py-3 text-right font-medium">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-3 font-medium">{user.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((role) => (
                                                <span
                                                    key={role.id}
                                                    className="rounded-md bg-muted px-2 py-1 text-xs"
                                                >
                                                        {role.name}
                                                    </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button asChild size="sm" variant="outline">
                                                <Link href={`/admin/users/${user.id}/edit`}>
                                                    <Pencil className="size-4" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => remove(user)}
                                            >
                                                <Trash2 className="size-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {users.data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={users.links}
                        from={users.from}
                        to={users.to}
                        total={users.total}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
