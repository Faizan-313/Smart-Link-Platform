import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import toast from "react-hot-toast";

type Visibility = "public" | "private";

const CreateLink = () => {
    const [url, setUrl] = useState("");
    const [visibility, setVisibility] = useState<Visibility>("public");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        const trimmedUrl = url.trim();
        if (!trimmedUrl) {
            toast.error("Please enter a valid URL");
            return;
        }

        try {
            new URL(trimmedUrl);
        } catch {
            toast.error("Please enter a valid URL");
            return;
        }

        setLoading(true);

        try {
            const shortUrl = await api<string>("POST", "/shortUrl", {
                url: trimmedUrl,
                visibility,
            });

            toast.success(`Short URL created: ${shortUrl}`);
            setUrl("");
            setVisibility("public");
            navigate("/dashboard");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Error creating the short URL";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">Create link</p>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-900">Shorten your URL</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="link" className="text-sm font-medium text-slate-700">
                            Full URL
                        </label>
                        <input
                            id="link"
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Visibility</label>
                        <div className="flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                            {(["public", "private"] as Visibility[]).map((option) => {
                                const selected = visibility === option;
                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setVisibility(option)}
                                        className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                                            selected
                                                ? "bg-slate-900 text-white shadow-sm"
                                                : "text-slate-600 hover:bg-white hover:text-slate-900"
                                        }`}
                                    >
                                        {option === "public" ? "Public" : "Private"}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creating..." : "Create short link"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateLink;
