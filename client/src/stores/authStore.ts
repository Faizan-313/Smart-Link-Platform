import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

interface AuthStore {
    user: User | null;
    loading: boolean;
    error: string | null;

    login: (data: {
        email: string;
        password: string;
    }) => Promise<{ success: boolean; message: string }>;

    register: (data: {
        username: string;
        email: string;
        password: string;
    }) => Promise<{ success: boolean; message: string }>;

    logout: () => void;
}


const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            loading: false,
            error: null,

            login: async (data) => {
                set({ loading: true, error: null });

                try {
                    const res = await axios.post(
                        `${import.meta.env.VITE_API_URL}/auth/login`,
                        data,
                        { withCredentials: true }
                    );

                    set({
                        user: res.data.user,
                        loading: false,
                        error: null,
                    });

                    return {success: true, message: "Login successfull"};
                } catch (error: unknown) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Login Failed... Please try again.";

                    set({
                        error: message,
                        loading: false,
                    });

                    return {success: false, message: message};
                }
            },

            register: async (data) => {
                set({ loading: true, error: null });

                try {
                    const res = await axios.post(
                        `${import.meta.env.VITE_API_URL}/auth/register`,
                        data,
                        { withCredentials: true }
                    );

                    set({
                        user: res.data.user,
                        loading: false,
                        error: null,
                    });
                    return {success: true, message: "Registration successfull"};
                } catch (error: unknown) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Registration Failed... Please try again.";

                    set({
                        error: message,
                        loading: false,
                    });
                    return {success: true, message: "Registration failed"};
                }
            },
            logout: async () => {
                set({ loading: true, error: null });
                try {
                    await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, { withCredentials: true });

                    set({
                        user: null,
                        loading: false,
                        error: null,
                    });
                } catch (error: unknown) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Logout Failed... Please try again.";

                    set({
                        error: message,
                        loading: false,
                    });
                }
                
            },
        }),
        {
            name: "auth-storage",
        }
    )
);

export default useAuthStore;