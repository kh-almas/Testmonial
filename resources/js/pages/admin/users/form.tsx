import type { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import FieldError from '@/components/admin/field-error';
import FlashMessages from '@/components/admin/flash-messages';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RoleOption } from '@/types/rbac';

type UserFormRecord = {
    id: number;
    name: string;
    email: string;
    role_ids: number[];
};

type Props = {
    user: UserFormRecord | null;
    roles: RoleOption[];
};

export default function UserForm({ user, roles }: Props) {
    const editing = user !== null;
    const form = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        role_ids: user?.role_ids ?? ([] as number[]),
    });

    function toggleRole(roleId: number, checked: boolean) {
        form.setData(
            'role_ids',
            checked
                ? [...form.data.role_ids, roleId]
                : form.data.role_ids.filter((id) => id !== roleId),
        );
    }

    function submit(event: FormEvent) {
        event.preventDefault();

        if (editing) {
            form.put(`/admin/users/${user.id}`);
            return;
        }

        form.post('/admin/users');
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Users', href: '/admin/users' },
                {
                    title: editing ? 'Edit user' : 'Add user',
                    href: editing ? `/admin/users/${user.id}/edit` : '/admin/users/create',
                },
            ]}
        >
            <Head title={editing ? 'Edit user' : 'Add user'} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {editing ? 'Edit user' : 'Add user'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Use the default Laravel user fields and assign at least one role.
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
                            autoComplete="name"
                        />
                        <FieldError message={form.errors.name} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.data.email}
                            onChange={(event) => form.setData('email', event.target.value)}
                            autoComplete="email"
                        />
                        <FieldError message={form.errors.email} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password {editing ? '(optional)' : ''}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={form.data.password}
                                onChange={(event) => form.setData('password', event.target.value)}
                                autoComplete="new-password"
                            />
                            <FieldError message={form.errors.password} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(event) =>
                                    form.setData('password_confirmation', event.target.value)
                                }
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <fieldset className="space-y-3">
                        <legend className="text-sm font-medium">Roles</legend>
                        <div className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
                            {roles.map((role) => (
                                <label key={role.id} className="flex items-start gap-3">
                                    <Checkbox
                                        checked={form.data.role_ids.includes(role.id)}
                                        onCheckedChange={(value) =>
                                            toggleRole(role.id, value === true)
                                        }
                                    />
                                    <span>
                                        <span className="block text-sm font-medium">{role.name}</span>
                                        <span className="block font-mono text-xs text-muted-foreground">
                                            {role.slug}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                        <FieldError message={form.errors.role_ids} />
                    </fieldset>

                    <div className="flex justify-end gap-2 border-t pt-5">
                        <Button asChild variant="outline">
                            <Link href="/admin/users">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving…' : editing ? 'Update user' : 'Create user'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
