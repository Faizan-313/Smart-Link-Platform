import { Link } from "react-router-dom";
import useAuthStore from "../stores/authStore";

function Footer() {
    const user = useAuthStore((state) => state.user);

    const linkColumns = [
        {
            title: "Product",
            links: [
                { label: "Features", href: "#" },
                { label: "Pricing", href: "#" },
                { label: "Roadmap", href: "#" },
            ],
        },
        {
            title: "Company",
            links: [
                { label: "About", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Careers", href: "#" },
            ],
        },
        {
            title: "Account",
            links: user
                ? [
                    { label: "Dashboard", href: "/dashboard" },
                    { label: "My Links", href: "/dashboard/my-links" },
                    { label: "Public Links", href: "/dashboard/public-links" },
                ]
                : [
                    { label: "Login", href: "/login" },
                    { label: "Register", href: "/register" },
                ],
        },
    ];

    return (
        <footer className="border-t border-slate-200 bg-slate-50 px-6 py-8">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
                    <div className="col-span-2 sm:col-span-1">
                        <div className="flex items-center gap-2.5">
                            <img src="/favicon.svg" alt="LinkFlow Logo" className="h-6 w-6" />
                            <span className="text-base font-semibold tracking-tight text-slate-900">
                                LinkFlow
                            </span>
                        </div>
                        <p className="mt-3 max-w-55 text-sm leading-relaxed text-slate-500">
                            A modern platform for sharing and growing your digital presence.
                        </p>
                        {user && (
                            <div className="mt-5 border-l-2 border-indigo-500 pl-3">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Signed in as
                                </p>
                                <p className="mt-1 max-w-55 truncate text-sm font-medium text-slate-700">
                                    {user.username || user.email}
                                </p>
                            </div>
                        )}
                    </div>

                    {linkColumns.map((column) => (
                        <div key={column.title}>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {column.title}
                            </p>
                            <ul className="mt-4 space-y-2.5">
                                {column.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            to={link.href}
                                            className="text-sm text-slate-600 transition-colors hover:text-slate-900"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-2 flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-200 pt-4 sm:flex-row">
                    <p className="text-sm text-slate-400">
                        &copy; {new Date().getFullYear()} LinkFlow. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <a href="#" className="transition-colors hover:text-slate-900">
                            Privacy
                        </a>
                        <a href="#" className="transition-colors hover:text-slate-900">
                            Terms
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;