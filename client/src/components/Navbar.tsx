import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="border-b border-slate-200 bg-white/90 px-6 py-4 shadow-sm backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
                <Link to="/" className="text-2xl flex font-bold items-center tracking-tight text-slate-900">
                    <span><img src="/favicon.svg" alt="LinkFlow Logo" className="h-10 w-10 p-2" /></span>
                    LinkFlow
                </Link>
                <div className="flex items-center gap-2">
                    <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                        Login
                    </Link>
                    <Link to="/register" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
                        Get started
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
