import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../api/api";
import type { LinkItem } from "../types/main.types";

interface LinkStore {
    links: LinkItem[];
    loading: boolean;
    error: string | null;

    fetchLinks: () => Promise<void>;
    deleteLink: (id: string) => Promise<void>;
}

const useLinkStore = create<LinkStore>()(
    persist(
        (set) => ({
            links: [] as LinkItem[],
            loading: false,
            error: null as string | null,

            fetchLinks: async () => {
                set({ loading: true, error: null });

                try {
                    const res = await api<LinkItem[]>("GET", "/shortUrl/user");
                    set({ links: res, loading: false });
                } catch {
                    set({ error: "Failed to fetch links", loading: false });
                }
            },

            deleteLink: async (id) => {
                await api("DELETE", `/shortUrl/${id}`);
                set((state) => ({
                    links: state.links.filter((link) => link._id !== id),
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