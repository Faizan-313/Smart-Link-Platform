import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Link2, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import useLinkStore from "../../stores/linkStore";
import type { LinkItem } from "../../types/main.types";

function MyLinks() {
    const links = useLinkStore((state) => state.links);
    const loading = useLinkStore((state) => state.loading);
    const error = useLinkStore((state) => state.error);
    const fetchLinks = useLinkStore((state) => state.fetchLinks);
    const deleteLink = useLinkStore((state) => state.deleteLink);

    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [selectedVisibility, setSelectedVisibility] = useState<"public" | "private">("public");
    const [linkToDelete, setLinkToDelete] = useState<LinkItem | null>(null);

    const publicLinks = links.filter((link) => link.visibility === "public");
    const privateLinks = links.filter((link) => link.visibility === "private");

    const visibleLinks = selectedVisibility === "public" ? publicLinks : privateLinks;

    useEffect(() => {
        void fetchLinks();
    }, [fetchLinks]);

    async function handleDelete() {
        if (!linkToDelete) return;

        setDeletingId(linkToDelete._id);
        try {
            await deleteLink(linkToDelete._id);
            toast.success("Link deleted");
            setLinkToDelete(null);
        } catch (deleteError) {
            const message = deleteError instanceof Error ? deleteError.message : "Failed to delete link";
            toast.error(message);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Link library</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Your links</h1>
                    <p className="mt-2 text-sm text-slate-500">Manage every short link from one place.</p>
                </div>
                <Link
                    to="/dashboard/create-link"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 active:scale-[0.98]"
                >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Create Link
                </Link>
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="font-semibold text-slate-900">All links</h2>
                        <p className="mt-1 text-xs text-slate-500">{links.length} {links.length === 1 ? "link" : "links"}</p>
                    </div>
                    <Link2 className="h-5 w-5 text-slate-300" aria-hidden="true" />
                </div>

                {error ? (
                    <div className="m-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                ) : null}

                <div className="border-b border-slate-100 px-5 py-3 sm:px-6">
                    <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
                        {(["public", "private"] as const).map((visibility) => {
                            const isSelected = selectedVisibility === visibility;
                            const count = visibility === "public" ? publicLinks.length : privateLinks.length;

                            return (
                                <button
                                    key={visibility}
                                    type="button"
                                    onClick={() => setSelectedVisibility(visibility)}
                                    aria-pressed={isSelected}
                                    className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize transition ${
                                        isSelected
                                            ? "bg-white text-slate-950 shadow-sm"
                                            : "text-slate-500 hover:text-slate-800"
                                    }`}
                                >
                                    {visibility} <span className="ml-1 text-xs font-medium text-slate-400">{count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-3 p-5 sm:p-6">
                        {[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-xl bg-slate-100" />)}
                    </div>
                ) : links.length > 0 ? (
                    <div className="max-h-100 overflow-y-auto overscroll-contain">
                        {visibleLinks.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {visibleLinks.map((link) => (
                                            <div
                                                key={link._id}
                                                className="group flex flex-col gap-2.5 px-5 py-3.5 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                                            >
                                                <div className="min-w-0">
                                                    <p className="mb-1 truncate text-sm font-semibold text-slate-950">{link.shortUrl}</p>
                                                    <p className="max-w-xl truncate text-xs text-slate-500">{link.fullUrl}</p>
                                                </div>

                                                <div className="flex items-center justify-between gap-4 sm:justify-end">
                                                    <span className="text-xs font-medium text-slate-500">{link.clicks} {link.clicks === 1 ? "click" : "clicks"}</span>
                                                    <a
                                                        href={`${import.meta.env.VITE_API_URL}/shortUrl/${link._id}`}
                                                        target="_blank"
                                                        rel="noreferrer noopener"
                                                        aria-label={`Open ${link.shortUrl}`}
                                                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                                                    >
                                                        Open <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => setLinkToDelete(link)}
                                                        disabled={deletingId === link._id}
                                                        aria-label={`Delete ${link.shortUrl}`}
                                                        className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                        ) : (
                            <p className="px-5 py-10 text-center text-sm text-slate-400">No {selectedVisibility} links yet.</p>
                        )}
                    </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                <Link2 className="h-7 w-7" aria-hidden="true" />
                            </span>
                            <p className="text-lg font-semibold text-slate-900">No links yet</p>
                            <p className="max-w-sm text-sm text-slate-500">Create a short link and it will appear here for easy tracking.</p>
                            <Link to="/dashboard/create-link" className="mt-2 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
                                <Plus className="h-4 w-4" aria-hidden="true" /> Create your first link
                            </Link>
                        </div>
                    )}
            </section>

            {linkToDelete ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 backdrop-blur-sm">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-link-title"
                        className="w-full max-w-sm rounded-2xl border border-white/70 bg-white p-6 shadow-2xl shadow-slate-950/20"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">Delete link</p>
                                <h2 id="delete-link-title" className="mt-2 text-lg font-semibold text-slate-950">Delete this short link?</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setLinkToDelete(null)}
                                aria-label="Close confirmation"
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                        <p className="mt-3 truncate rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">{linkToDelete.shortUrl}</p>
                        <p className="mt-3 text-sm leading-6 text-slate-500">This action cannot be undone. The short link will stop working immediately.</p>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setLinkToDelete(null)}
                                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => void handleDelete()}
                                disabled={deletingId === linkToDelete._id}
                                className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deletingId === linkToDelete._id ? "Deleting..." : "Delete link"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default MyLinks
