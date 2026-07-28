import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const menuItems = [
    {
        name: "Dashboard",
        to: "/dashboard",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h4.5m-4.5 5.25h4.5M3.75 6.75h4.5m4.5 10.5h7.5m-7.5-5.25h7.5m-7.5-5.25h7.5" />
            </svg>
        ),
    },
    {
        name: "Settings",
        to: "/dashboard/settings",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.146.083.217.127.325.199.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.075-1.076.124a6.47 6.47 0 0 1-.216.126c-.332.184-.582.496-.645.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.217-.127c-.325-.199-.72-.257-1.076-.124l-1.216.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7.65 7.65 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.369-.491l1.216.456c.356.133.751.075 1.076-.124.072-.044.144-.087.217-.127.332-.184.582-.496.644-.87l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        ),
    },
];

function Navbar() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        navigate("/");
    };

    return (
        <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-3 shadow-sm backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
                    <img src="/favicon.svg" alt="LinkFlow Logo" className="h-8 w-8" />
                    LinkFlow
                </Link>

                {!user ? (
                    <div className="flex items-center gap-2">
                        <Link
                            to="/login"
                            className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700"
                        >
                            Get started
                        </Link>
                    </div>
                ) : (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsOpen((open) => !open)}
                            className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                />
                            </svg>
                            <span>{user.username ? user.username: user.email}</span>
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                                <div className="border-b border-slate-100 px-3 py-2">
                                    <p className="truncate text-sm font-medium text-slate-900">{user.email}</p>
                                    <p className="text-xs text-slate-400">Signed in</p>
                                </div>

                                <div className="mt-2 space-y-1">
                                    {menuItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.to}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                        >
                                            <span className="text-slate-400">{item.icon}</span>
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-2 border-t border-slate-100 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.75"
                                            className="h-4 w-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                                            />
                                        </svg>
                                        Log out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;