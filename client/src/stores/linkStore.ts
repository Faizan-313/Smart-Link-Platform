import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../api/api";
import type { LinkItem } from "../types/main.types";

interface LinkStore {
    userLinks: LinkItem[];
    publicLinks: LinkItem[];
    loading: boolean;
    error: string | null;

    fetchUserLinks: () => Promise<void>;
    fetchPublicLinks: () => Promise<void>;
    deleteLink: (id: string) => Promise<void>;
}

const useLinkStore = create<LinkStore>()(
    persist(
        (set) => ({
            userLinks: [] as LinkItem[],
            publicLinks: [] as LinkItem[],
            loading: false,
            error: null as string | null,

            fetchUserLinks: async () => {
                set({ loading: true, error: null });
                try {
                    const res = await api<LinkItem[]>("GET", "/shortUrl/user");
                    set({ userLinks: res, loading: false });
                } catch {
                    set({ error: "Failed to fetch links", loading: false });
                }
            },

            fetchPublicLinks: async () => {
                set({ loading: true, error: null });
                try {
                    const res = await api<LinkItem[]>("GET", "/shortUrl");
                    set({ publicLinks: res, loading: false});
                } catch {
                    set({ error: "Failed to fetch links", loading: false });
                }
            },

            deleteLink: async (id) => {
                await api("DELETE", `/shortUrl/${id}`);
                set((state) => ({
                    userLinks: state.userLinks.filter((link) => link._id !== id),
                    error: null,
                }));
            },
        }),
        {
            name: "link-storage",
        }
    )
);

export default useLinkStore;