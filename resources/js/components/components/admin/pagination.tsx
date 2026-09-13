import { Link } from '@inertiajs/react';

type Props = {
    links: Array<{ url: string | null; label: string; active: boolean }>;
    from: number | null;
    to: number | null;
    total: number;
};

export default function Pagination({ links, from, to, total }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm">
            <span className="text-muted-foreground">
                Showing {from ?? 0}–{to ?? 0} of {total}
            </span>

            <nav aria-label="Pagination" className="flex flex-wrap gap-1">
                {links.map((link, index) => {
                    const label = link.label.includes('Previous')
                        ? 'Previous'
                        : link.label.includes('Next')
                            ? 'Next'
                            : link.label;

                    return link.url ? (
                        <Link
                            key={index}
                            href={link.url}
                            aria-current={link.active ? 'page' : undefined}
                            className={`rounded-md border px-3 py-1.5 ${
                                link.active ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50'
                            }`}
                        >
                            {label}
                        </Link>
                    ) : (
                        <span key={index} className="rounded-md border px-3 py-1.5 opacity-40">
                            {label}
                        </span>
                    );
                })}
            </nav>
        </div>
    );
}
