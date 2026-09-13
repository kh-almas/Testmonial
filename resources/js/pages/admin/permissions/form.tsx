import type { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import FieldError from '@/components/admin/field-error';
import FlashMessages from '@/components/admin/flash-messages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PermissionFormRecord = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    protected: boolean;
};

type Props = {
    permission: PermissionFormRecord | null;
};

export default function PermissionForm({ permission }: Props) {
    const editing = permission !== null;
    const form = useForm({
        name: permission?.name ?? '',
        slug: permission?.slug ?? '',
        description: permission?.description ?? '',
    });

    function submit(event: FormEvent) {
        event.preventDefault();

        if (editing) {
            form.put(`/admin/permissions/${permission.id}`);
            return;
        }

        form.post('/admin/permissions');
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Permissions', href: '/admin/permissions' },
                {
                    title: editing ? 'Edit permission' : 'Add permission',
                    href: editing
                        ? `/admin/permissions/${permission.id}/edit`
                        : '/admin/permissions/create',
                },
            ]}
        >
            <Head title={editing ? 'Edit permission' : 'Add permission'} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {editing ? 'Edit permission' : 'Add permission'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Use a short resource.action slug.
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
                            placeholder="stories.manage"
                            disabled={permission?.protected === true}
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

                    <div className="flex justify-end gap-2 border-t pt-5">
                        <Button asChild variant="outline">
                            <Link href="/admin/permissions">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing
                                ? 'Saving…'
                                : editing
                                    ? 'Update permission'
                                    : 'Create permission'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
