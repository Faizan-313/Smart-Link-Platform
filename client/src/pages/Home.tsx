
const Home = () => {
    return (
        <main className="relative flex flex-1 items-center overflow-hidden bg-slate-50 px-6 py-16 text-slate-900">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[32px] border-slate-200/70" />
            <div className="pointer-events-none absolute bottom-10 left-8 h-16 w-16 rounded-2xl border border-slate-200 bg-white/70" />

            <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 md:flex-row md:items-center md:justify-between md:p-12">
                <div className="max-w-xl">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                        LinkFlow
                    </p>
                    <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                        Share every link with confidence.
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-slate-600">
                        Create clean, memorable short links and keep them organized in one place.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a href="/register" className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700">
                            Get started
                        </a>
                        <a href="/login" className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                            Sign in
                        </a>
                    </div>
                </div>

                <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                        <p className="text-sm font-medium text-slate-300">Your links</p>
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>
                    <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Short link</p>
                        <p className="mt-2 text-xl font-semibold">linkflow/abc123</p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home
