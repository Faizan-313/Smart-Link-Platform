import { Mail, Lock, LogIn, Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../stores/authStore";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);
    const error = useAuthStore((state) => state.error);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if ([formData.email, formData.password].some((field) => field.trim() === "")) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            await login(formData);
            navigate("/dashboard");
        } catch {
            toast.error(error);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#f8fafc,#f1f5f9_35%,#e2e8f0)] px-4 py-10">
            <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/80">
                <div className="mb-8 text-center">
                    <div className="mb-4 text-2xl font-semibold tracking-tight text-slate-900">LinkFlow</div>
                    <h2 className="text-3xl font-semibold text-slate-900">Welcome back</h2>
                    <p className="mt-2 text-sm text-slate-600">Sign in to continue managing your shared links and content.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                autoComplete="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                required
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-3 text-slate-700 outline-none transition focus:border-slate-900 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                            <button type="button" className="absolute right-3 top-3.5 text-slate-500" onClick={() => setShowPassword((prev) => !prev)}>
                                {showPassword ? <Eye className="h-5 w-5" /> : <EyeClosed className="h-5 w-5" />}
                            </button>
                            <input
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-10 text-slate-700 outline-none transition focus:border-slate-900 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end text-sm">
                        <Link to="/forgot-password" className="font-medium text-slate-700 transition hover:text-slate-900">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Signing in...
                        </span>
                        ) : (
                        <span className="flex items-center justify-center gap-2">
                            <LogIn className="h-5 w-5" />
                            Log in
                        </span>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    New here?{' '}
                    <Link to="/register" className="font-semibold text-slate-900 transition hover:text-slate-700">
                        Create an account
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login