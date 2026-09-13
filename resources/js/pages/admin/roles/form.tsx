import type { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import FieldError from '@/components/admin/field-error';
import FlashMessages from '@/components/admin/flash-messages';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PermissionOption } from '@/types/rbac';

type RoleFormRecord = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    permission_ids: number[];
};

type Props = {
    role: RoleFormRecord | null;
    permissions: PermissionOption[];
};

export default function RoleForm({ role, permissions }: Props) {
    const editing = role !== null;
    const form = useForm({
        name: role?.name ?? '',
        slug: role?.slug ?? '',
        description: role?.description ?? '',
        permission_ids: role?.permission_ids ?? ([] as number[]),
    });

    function togglePermission(permissionId: number, checked: boolean) {
        form.setData(
            'permission_ids',
            checked
                ? [...form.data.permission_ids, permissionId]
                : form.data.permission_ids.filter((id) => id !== permissionId),
        );
    }

    function submit(event: FormEvent) {
        event.preventDefault();

        if (editing) {
            form.put(`/admin/roles/${role.id}`);
            return;
        }

        form.post('/admin/roles');
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Roles', href: '/admin/roles' },
                {
                    title: editing ? 'Edit role' : 'Add role',
                    href: editing ? `/admin/roles/${role.id}/edit` : '/admin/roles/create',
                },
            ]}
        >
            <Head title={editing ? 'Edit role' : 'Add role'} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {editing ? 'Edit role' : 'Add role'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Create a role and choose what it can manage.
                    </p>
                </div>

                <FlashMessages />

                <form onSubmit={submit} className="space-y-5 rounded-xl border bg-card p-5 shadow-sm">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={form.data.name}
                            onChange={(event) => form.setData('name', event.target.value)}
                        />
                        <FieldError message={form.errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={form.data.slug}
                            onChange={(event) => form.setData('slug', event.target.value)}
                            placeholder="moderator"
                            disabled={role?.slug === 'admin'}
                            className="font-mono"
                        />
                        <FieldError message={form.errors.slug} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            rows={3}
                            value={form.data.description}
                            onChange={(event) => form.setData('description', event.target.value)}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <FieldError message={form.errors.description} />
                    </div>

                    <fieldset className="space-y-3">
                        <legend className="text-sm font-medium">Permissions</legend>
                        <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
                            {permissions.map((permission) => (
                                <label key={permission.id} className="flex items-start gap-3">
                                    <Checkbox
                                        checked={form.data.permission_ids.includes(permission.id)}
                                        onCheckedChange={(value) =>
                                            togglePermission(permission.id, value === true)
                                        }
                                    />
                                    <span>
                                        <span className="block text-sm font-medium">
                                            {permission.name}
                                        </span>
                                        <span className="block font-mono text-xs text-muted-foreground">
                                            {permission.slug}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                        <FieldError message={form.errors.permission_ids} />
                    </fieldset>

                    <div className="flex justify-end gap-2 border-t pt-5">
                        <Button asChild variant="outline">
                            <Link href="/admin/roles">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving…' : editing ? 'Update role' : 'Create role'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
