const stats = [
    { label: "Total links", value: "0" },
    { label: "Total clicks", value: "0" },
    { label: "Public links", value: "0" },
];

const recentLinks = [
    { title: "Welcome link", url: "linkflow/hello" },
    { title: "Product launch", url: "linkflow/launch" },
];

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Overview</p>
                    <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
                </div>
                <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
                    + Create Link
                </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
                </div>
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">Recent links</h2>
                        <a href="/dashboard/links" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                            View all
                        </a>
                    </div>
                    <div className="mt-4 space-y-3">
                        {recentLinks.map((link) => (
                        <div key={link.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                            <p className="font-medium text-slate-900">{link.title}</p>
                            <p className="mt-1 text-sm text-slate-500">{link.url}</p>
                        </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
                    <div className="mt-4 space-y-3">
                        <button className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                            + Create Link
                        </button>
                        <button className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                            + Add Collection
                        </button>
                        <button className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                            + Explore future features
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard
