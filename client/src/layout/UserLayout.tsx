import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const navigation = [
    {
        name: "Dashboard",
        to: "/dashboard",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h4.5m-4.5 5.25h4.5M3.75 6.75h4.5m4.5 10.5h7.5m-7.5-5.25h7.5m-7.5-5.25h7.5" />
            </svg>
        ),
    },
    {
        name: "My Links",
        to: "/dashboard/my-links",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
        ),
    },
    {
        name: "Public Links",
        to: "/dashboard/public-links",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a14.98 14.98 0 0 1-3.75-9A14.98 14.98 0 0 1 12 3m0 18a14.98 14.98 0 0 0 3.75-9A14.98 14.98 0 0 0 12 3m-9 9h18" />
            </svg>
        ),
    },
    {
        name: "Settings",
        to: "#",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.146.083.217.127.325.199.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.075-1.076.124a6.47 6.47 0 0 1-.216.126c-.332.184-.582.496-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.217-.127c-.325-.199-.72-.257-1.076-.124l-1.216.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7.65 7.65 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.369-.491l1.216.456c.356.133.751.075 1.076-.124.072-.044.144-.087.217-.127.332-.184.582-.496.644-.87l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        ),
    },
];

function UserLayout() {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="dashboard-backdrop min-h-[76vh] bg-slate-50 text-slate-900">
            {/* Mobile nav */}
            <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
                <div className="flex gap-2 overflow-x-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                            <Link
                                key={item.name}
                                to={item.to}
                                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
                <aside className="hidden w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 pb-10 shadow-sm lg:block">
                    <p className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Menu
                    </p>
                    <div className="mt-2 space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.to;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.to}
                                    className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                                >
                                    {isActive && (
                                        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600" />
                                    )}
                                    <span className={isActive ? "text-indigo-600" : "text-slate-400"}>
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    <hr className="my-6 border-slate-100" />

                    <div>
                        <p className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Quick actions
                        </p>
                        <div className="mt-3 space-y-2 px-1">
                            <button className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                                + Add Collection
                            </button>
                            <button className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-500 transition hover:border-slate-400 hover:text-slate-700">
                                + More, coming soon
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default UserLayout;