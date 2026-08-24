import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../api/api";
import type { LinkItem } from "../types/main.types";

interface LinkStore {
    userLinks: LinkItem[];
    publicLinks: LinkItem[];
    userLinksLoaded: boolean;
    userLinksOwnerId: string | null;
    loading: boolean;
    error: string | null;

    fetchUserLinks: (ownerId: string) => Promise<void>;
    fetchPublicLinks: () => Promise<void>;
    invalidateUserLinks: () => void;
    deleteLink: (id: string) => Promise<void>;
}

const useLinkStore = create<LinkStore>()(
    persist(
        (set) => ({
            userLinks: [] as LinkItem[],
            publicLinks: [] as LinkItem[],
            userLinksLoaded: false,
            userLinksOwnerId: null,
            loading: false,
            error: null as string | null,

            fetchUserLinks: async (ownerId) => {
                const state = useLinkStore.getState();
                if (state.userLinksLoaded && state.userLinksOwnerId === ownerId) return;

                set({ loading: true, error: null });
                try {
                    const res = await api<LinkItem[]>("GET", "/shortUrl/user");
                    set({ userLinks: res, userLinksLoaded: true, userLinksOwnerId: ownerId, loading: false });
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

            invalidateUserLinks: () => {
                set({ userLinksLoaded: false });
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