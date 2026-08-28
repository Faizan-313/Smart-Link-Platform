import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { api } from "../api/api";
import useLinkStore from "./linkStore";

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

                    if(axios.isAxiosError(error) && error.response?.status === 429){
                        return {success: false, message: "Too many requests. Please try again later."};
                    }

                    return {success: false, message: "Login Failed... Please try again."};
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

                    if(axios.isAxiosError(error) && error.response?.status === 429){
                        return {success: false, message: "Too many requests. Please try again later."};
                    }

                    return {success: false, message: "Registration failed"};
                }
            },

            logout: async () => {
                set({ loading: true, error: null });
                const emptyLinkStore = useLinkStore.getState().emptyStore;
                try {
                    await api("POST", "/auth/logout");

                    set({
                        user: null,
                        loading: false,
                        error: null,
                    });
                    emptyLinkStore();
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