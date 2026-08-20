import { useEffect } from "react";
import { Link } from "react-router-dom";
import useLinkStore from "../../stores/linkStore";

const Dashboard = () => {
    const fetchLinks = useLinkStore((state) => state.fetchLinks);
    const Links = useLinkStore((state) => state.links);
    const loading = useLinkStore((state) => state.loading);

    useEffect(() => {
        void fetchLinks();
    }, [fetchLinks]);

    const recentLinks = [...Links]
        .sort(
            (a, b) =>
                new Date(b.createdAt ?? 0).getTime() -
                new Date(a.createdAt ?? 0).getTime()
        )
        .slice(0, 2);

    const stats = [
        {
            label: "Total links",
            value: String(Links.length),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5 21 3m0 0h-5.25M21 3v5.25M11 4H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 6.28 2 7.12 2 8.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 22 5.12 22 6.8 22h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C20 19.72 20 18.88 20 17.2V13" />
                </svg>
            ),
            accent: "bg-indigo-50 text-indigo-600",
        },
        {
            label: "Private links",
            value: String(Links.filter((link) => link.visibility === "private").length),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM6.75 10.5V6.75a5.25 5.25 0 0 1 10.5 0V10.5m-11.25 0h12c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-12A1.125 1.125 0 0 1 4.875 19.875v-8.25c0-.621.504-1.125 1.125-1.125Z" />
                </svg>
            ),
            accent: "bg-amber-50 text-amber-600",
        },
        {
            label: "Public links",
            value: String(Links.filter((link) => link.visibility === "public").length),
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a14.98 14.98 0 0 1-3.75-9A14.98 14.98 0 0 1 12 3m0 18a14.98 14.98 0 0 0 3.75-9A14.98 14.98 0 0 0 12 3m-9 9h18" />
                </svg>
            ),
            accent: "bg-emerald-50 text-emerald-600",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-indigo-600">Overview</p>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Track your links today — collections, teams, and analytics are on the way.
                    </p>
                </div>
                <Link
                    to="/dashboard/create-link"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 active:scale-[0.98]"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create Link
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                    >
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.accent}`}>
                            {stat.icon}
                        </span>
                        <div>
                            <p className="text-sm text-slate-500">{stat.label}</p>
                            <p className="mt-0.5 text-2xl font-semibold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Created links</h2>
                        <p className="text-sm text-slate-500">Your most recent activity</p>
                    </div>
                    <a
                        href="/dashboard/my-links"
                        className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
                    >
                        View all →
                    </a>
                </div>
                <hr className="my-4 border-slate-100" />

                {loading ? (
                    <div className="py-10 text-center text-sm text-slate-500">Loading your links...</div>
                ) : recentLinks.length > 0 ? (
                    <div className="space-y-3 max-h-54 ">
                        {recentLinks.map((link) => (
                            <div
                                key={link._id}
                                className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0">
                                    <div className="mb-1 flex items-center gap-2">
                                        <p className="truncate font-medium text-slate-900">{link.shortUrl}</p>
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                                                link.visibility === "public"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-amber-100 text-amber-700"
                                            }`}
                                        >
                                            {link.visibility}
                                        </span>
                                    </div>
                                    <p className="truncate text-sm text-slate-500">{link.fullUrl}</p>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="rounded-full bg-white px-2 py-1">{link.clicks} clicks</span>
                                    <a 
                                        href={`${import.meta.env.VITE_API_URL}/shortUrl/${link._id}`} 
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="font-medium text-indigo-600 hover:text-indigo-700"
                                    >
                                            Open
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                            </svg>
                        </span>
                        <div>
                            <p className="font-medium text-slate-900">No links yet</p>
                            <p className="mt-1 max-w-xs text-sm text-slate-500">
                                Create your first short link to see it show up here.
                            </p>
                        </div>
                        <Link
                            to="/dashboard/create-link"
                            className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
                        >
                            Create link
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;