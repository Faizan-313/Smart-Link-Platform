const features = [
    {
        title: "Link management",
        description: "Organize your links, keep them tidy, and share them with confidence.",
    },
    {
        title: "Future-ready dashboard",
        description: "A central place to grow features like analytics, collections, and automation.",
    },
    {
        title: "Smarter sharing",
        description: "Prepare for richer content experiences, custom flows, and team collaboration.",
    },
];

const ideas = [
    "Advanced analytics and click insights",
    "Custom branded pages and collections",
    "Team workspaces and shared dashboards",
    "AI-assisted link organization",
];

const Home = () => {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#f8fafc,#f1f5f9_45%,#e2e8f0)] px-6 py-16 text-slate-900">
            <section className="mx-auto flex max-w-6xl flex-col gap-8 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-200/70 backdrop-blur md:flex-row md:items-center md:justify-between md:p-12">
                <div className="max-w-2xl">
                    <p className="mb-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        Smarter sharing for the future
                    </p>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                        Manage links, content, and digital connections in one place.
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-slate-600">
                        LinkFlow is growing beyond simple short URLs. It is a flexible platform for sharing, organizing, and scaling your online presence.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a href="/register" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700">
                            Create your account
                        </a>
                        <a href="/login" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                            Sign in
                        </a>
                    </div>
                </div>

                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-lg">
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Platform preview</p>
                    <div className="mt-4 rounded-2xl bg-white/10 p-4">
                        <p className="text-sm text-slate-300">Shared destination</p>
                        <p className="mt-2 break-all text-sm font-medium">https://example.com/your-growing-digital-space</p>
                    </div>
                    <div className="mt-4 rounded-2xl bg-white/10 p-4">
                        <p className="text-sm text-slate-300">Smart short link</p>
                        <p className="mt-2 text-2xl font-semibold">linkflow/abc123</p>
                    </div>
                    <div className="mt-4 rounded-2xl bg-emerald-500/20 p-4 text-sm text-emerald-100">
                        Built to expand with more features in the future.
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-10 max-w-6xl">
                <div className="grid gap-6 md:grid-cols-3">
                    {features.map((feature) => (
                        <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                            <p className="mt-2 text-sm leading-7 text-slate-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-10 max-w-6xl rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-xl">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-slate-200">
                            Future ideas
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight">A platform that can grow with your ideas</h2>
                        <p className="mt-3 text-base leading-8 text-slate-300">
                            This project is a foundation for more than link shortening. Think analytics, custom pages, collaboration, and smarter workflows.
                        </p>
                    </div>
                    <ul className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                        {ideas.map((idea) => (
                            <li key={idea} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                                {idea}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
    );
};

export default Home
