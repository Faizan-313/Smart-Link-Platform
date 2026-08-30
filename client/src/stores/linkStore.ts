import { create } from "zustand";
import { api } from "../api/api";
import type { LinkItem } from "../types/main.types";

interface LinkStore {
    userLinks: LinkItem[];
    publicLinks: LinkItem[];
    userLinksLoaded: boolean;
    userLinksOwnerId: string | null;
    loading: boolean;
    error: string | null;
    cursor: string | null;

    fetchUserLinks: (ownerId: string) => Promise<void>;
    fetchPublicLinks: (url: string, append?: boolean) => Promise<void>;
    invalidateUserLinks: () => void;
    emptyStore: () => void;
    deleteLink: (id: string) => Promise<void>;
}

interface ApiResponse<T> {
    publicLinks: T;
    cursor: string | null;
}

const useLinkStore = create<LinkStore>()((set) => ({
    userLinks: [] as LinkItem[],
    publicLinks: [] as LinkItem[],
    userLinksLoaded: false,
    userLinksOwnerId: null,
    loading: false,
    error: null as string | null,
    cursor: null as string | null,

    fetchUserLinks: async (ownerId) => {
        set({ loading: true, error: null });
        try {
            const res = await api<LinkItem[]>("GET", "/shortUrl/user");
            set({ userLinks: res, userLinksLoaded: true, userLinksOwnerId: ownerId, loading: false });
        } catch {
            set({ error: "Failed to fetch links", loading: false });
        }
    },

    fetchPublicLinks: async (url: string, append = false) => {
        set({ loading: true, error: null });
        try {
            const res = await api<ApiResponse<LinkItem[]>>("GET", url);
            set((state) => ({
                publicLinks: append ? [...state.publicLinks, ...res.publicLinks] : res.publicLinks,
                cursor: res.cursor,
                loading: false,
            }));
        } catch {
            set({ error: "Failed to fetch links", loading: false });
        }
    },

    invalidateUserLinks: () => {
        set({ userLinksLoaded: false });
    },

    emptyStore: () => {
        set({
            userLinks: [],
            publicLinks: [],
            userLinksLoaded: false,
            userLinksOwnerId: null,
            loading: false,
            error: null,
            cursor: null,
        });
    },

    deleteLink: async (id) => {
        await api("DELETE", `/shortUrl/${id}`);
        set((state) => ({
            userLinks: state.userLinks.filter((link) => link._id !== id),
            error: null,
        }));
    },
}));

export default useLinkStore;