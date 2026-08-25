import { Mail, Lock, User, UserPlus, Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/authStore";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const register = useAuthStore((state) => state.register);
    const login = useAuthStore((state) => state.login);
    const error = useAuthStore((state) => state.error);
    const loading = useAuthStore((state) => state.loading);

    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (user != null) {
            toast.error("Please logout first");
            navigate("/dashboard", { replace: true });
        }
    }, [navigate, user]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        if ([formData.username, formData.email, formData.password].some((field) => field.trim() === "")) {
            toast.error("Please fill in all fields");
            return;
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        try {
            const response: { success: boolean, message: string}  = await register(formData);    
            if(response.success){
                toast.success("Account created successfully.");
                const data = {
                    email: formData.email,
                    password: formData.password,
                }
                const loginResponse: { success: boolean, message: string } = await login(data);
                if(loginResponse.success) {
                    toast.success(loginResponse.message || "Login successful");
                    navigate("/dashboard");
                } else {
                    toast.error(response.message || "Login failed. Please try again.");
                }
            } else {
                toast.error("Registration failed. Please try again.");
            }

        } catch {
            toast.error(error);
        } 
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#f8fafc,#f1f5f9_35%,#e2e8f0)] px-4 py-10">
            <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/80">
                <div className="mb-8 text-center">
                    <div className="mb-4 text-2xl font-semibold tracking-tight text-slate-900">LinkFlow</div>
                    <h2 className="text-3xl font-semibold text-slate-900">Create your account</h2>
                    <p className="mt-2 text-sm text-slate-600">Start building your future-ready sharing experience.</p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    <div>
                        <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700">
                            Full name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                id="username"
                                name="username"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Alex Morgan"
                                required
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-3 text-slate-700 outline-none transition focus:border-slate-900 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                            Email address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="email"
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
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                minLength={6}
                                required
                                autoComplete="new-password"
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-10 text-slate-700 outline-none transition focus:border-slate-900 focus:bg-white"
                            />
                        </div>
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
                            Creating account...
                        </span>
                        ) : (
                        <span className="flex items-center justify-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Create account
                        </span>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-slate-900 transition hover:text-slate-700">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register