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
    }) => Promise<void>;

    register: (data: {
        username: string;
        email: string;
        password: string;
    }) => Promise<void>;

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
                        data
                    );

                    set({
                        user: res.data.user,
                        loading: false,
                        error: null,
                    });
                } catch (error: unknown) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Login Failed... Please try again.";

                    set({
                        error: message,
                        loading: false,
                    });
                }
            },

            register: async (data) => {
                set({ loading: true, error: null });

                try {
                    const res = await axios.post(
                        `${import.meta.env.VITE_API_URL}/auth/register`,
                        data
                    );

                    set({
                        user: res.data.user,
                        loading: false,
                        error: null,
                    });
                } catch (error: unknown) {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Registration Failed... Please try again.";

                    set({
                        error: message,
                        loading: false,
                    });
                }
            },

            logout: () => {
                set({
                    user: null,
                    error: null,
                });
            },
        }),
        {
            name: "auth-storage",
        }
    )
);

export default useAuthStore;