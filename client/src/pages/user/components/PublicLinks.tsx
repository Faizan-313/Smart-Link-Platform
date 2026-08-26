import { Link } from "react-router-dom";
import { ExternalLink, Link2, Medal, Plus } from "lucide-react";
import useLinkStore from "../../../stores/linkStore";
import { useEffect } from "react";

const PublicLinks = () => {
    const links = useLinkStore((state) => state.publicLinks);
    const fetchLinks = useLinkStore((state) => state.fetchPublicLinks);
    const loading = useLinkStore((state) => state.loading);
    const error = useLinkStore((state) => state.error);

    useEffect(() => {
        void fetchLinks();
    }, [fetchLinks ])

    const sortedLinks = [...links].sort((a, b) => {
        return b.clicks - a.clicks; 
    })

    const rankStyles = [
        {
            row: "rank-gold border-l-amber-400 bg-amber-50/50",
            medal:
            "rank-gold-medal bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-sm shadow-amber-200 ring-6 ring-amber-100",
            label: "1st",
        },
        {
            row: "rank-silver border-l-slate-400 bg-slate-50/70",
            medal:
            "rank-silver-medal bg-gradient-to-br from-slate-300 to-slate-500 text-white shadow-sm shadow-slate-200 ring-4 ring-amber-100",
            label: "2nd",
        },
        {
            row: "rank-bronze border-l-orange-400 bg-orange-50/50",
            medal:
            "rank-bronze-medal bg-gradient-to-br from-orange-300 to-orange-500 text-white shadow-sm shadow-orange-200 ring-2 ring-amber-100",
            label: "3rd",
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">World links</h1>
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

                {loading ? (
                    <div className="space-y-3 max-h-100 p-5 sm:p-6">
                        {[1,2].map((item) => <div key={item} className="h-24 animate-pulse rounded-xl bg-slate-100" />)}
                    </div>
                ) : sortedLinks.length > 0 ? (
                    <div className="max-h-100 overflow-y-auto overscroll-contain">
                        <div className="divide-y divide-slate-100">
                            {sortedLinks.map((link, index) => (
                                <div
                                    key={link._id}
                                    className={`group flex flex-col gap-2.5 px-5 py-3.5 transition-all duration-200
                                        hover:bg-slate-50/80 hover:shadow-sm
                                        sm:flex-row sm:items-center sm:justify-between sm:px-6
                                        border-l-4
                                        ${rankStyles[index]?.row ?? "border-l-transparent bg-white"}`}
                                >
                                    <div className="flex min-w-0 items-start gap-3">
                                        {rankStyles[index] ? (
                                            <span
                                                title={`${rankStyles[index].label} place`}
                                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${rankStyles[index].medal}`}
                                            >
                                                <Medal className="h-4 w-4" aria-hidden="true" />
                                                <span className="sr-only">{rankStyles[index].label} place</span>
                                            </span>
                                        ) : null}
                                        <div className="min-w-0">
                                            <div className="mb-1 flex min-w-0 items-center gap-2">
                                                <p className="truncate text-sm font-semibold text-slate-950">{link.shortUrl}</p>
                                                <span className="max-w-[45%] truncate text-[11px] font-medium text-slate-400">by {link.username ?? "Unknown user"}</span>
                                            </div>
                                        <p className="max-w-xl truncate text-xs text-slate-500">{link.fullUrl}</p>
                                        </div>
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
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                <Link2 className="h-7 w-7" aria-hidden="true" />
                            </span>
                            <p className="text-lg font-semibold text-slate-900">No links yet</p>
                            <Link to="/dashboard/create-link" className="mt-2 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500">
                                <Plus className="h-4 w-4" aria-hidden="true" /> Create link
                            </Link>
                        </div>
                    )}
            </section>
        </div>
    )
}

export default PublicLinks
