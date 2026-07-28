function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white px-6 py-8">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
                    <div className="text-center sm:text-left">
                        <p className="flex items-center justify-center gap-2 text-lg font-semibold text-slate-900 sm:justify-start">
                            <img src="/favicon.svg" alt="LinkFlow Logo" className="h-6 w-6" />
                            LinkFlow
                        </p>
                        <p className="mt-1 max-w-xs text-sm text-slate-500">
                            A modern platform for sharing and growing your digital presence.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-600 sm:justify-end">
                        <a href="/login" className="transition hover:text-slate-900">Login</a>
                        <a href="/register" className="transition hover:text-slate-900">Register</a>
                        <a href="#" className="transition hover:text-slate-900">Roadmap</a>
                    </div>
                </div>

                <hr className="my-6 border-slate-100" />

                <p className="text-center text-sm text-slate-400">
                    &copy; {new Date().getFullYear()} LinkFlow. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;