

function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white/90 px-6 py-4 shadow-sm backdrop-blur">
            <div className="mx-auto max-w-6xl">
                <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div>
                        <p className="text-lg font-semibold text-slate-900">LinkFlow</p>
                        <p className="mt-1 text-sm text-slate-600">A modern platform for sharing and growing your digital presence.</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <a href="/login" className="transition hover:text-slate-900">Login</a>
                        <a href="/register" className="transition hover:text-slate-900">Register</a>
                        <a href="#" className="transition hover:text-slate-900">Future ideas</a>
                    </div>
                </div>
                
                <p className="text-center text-sm text-slate-500">
                    &copy; {new Date().getFullYear()} LinkFlow. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer
