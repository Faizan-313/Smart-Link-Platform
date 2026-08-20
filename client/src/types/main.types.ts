type LinkItem = {
    _id: string;
    fullUrl: string;
    shortUrl: string;
    visibility: "public" | "private";
    clicks: number;
    createdAt?: string;
};

export type {
    LinkItem,
}