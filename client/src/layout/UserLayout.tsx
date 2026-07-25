import { Outlet, Link, useLocation } from "react-router-dom";

const navigation = [
    { name: "Dashboard", to: "/dashboard" },
    { name: "My Links", to: "/dashboard/links" },
    { name: "Collections", to: "/dashboard/collections" },
    { name: "Analytics", to: "/dashboard/analytics" },
    { name: "Settings", to: "/dashboard/settings" },
];

function UserLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                            LF
                        </div>
                        <div>
                            <p className="text-lg font-semibold">LinkFlow</p>
                            <p className="text-sm text-slate-500">Workspace dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                            Search links
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                            U
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto flex max-w-7xl gap-6 px-6 py-6">
                <aside className="hidden w-72 shrink-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
                    <div className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.to;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.to}
                                    className={`flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                        isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-8 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-900">Future modules</p>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                            You can easily add QR codes, API tools, analytics views, and more here.
                        </p>
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