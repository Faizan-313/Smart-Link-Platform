import { urlModel } from "../models/shortUrl.model"
import express from "express"
import mongoose from "mongoose"
import { AuthenticatedRequest } from "../types/main.types";

const getUserId = (req: AuthenticatedRequest) => {
    const user = req.user;
    if (user && typeof user === "object" && "_id" in user) {
        return user._id?.toString();
    }
    return undefined;
};

const createUrl = async (req: AuthenticatedRequest, res: express.Response) => {
    try {
        const { url, visibility } = req.body ?? {};
        if (!url) {
            return res.status(400).json({ message: "url is required" });
        }

        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let existingUrl;

        if (visibility === "public") {
            // Public URL must be unique across the entire platform
            existingUrl = await urlModel.findOne({
                fullUrl: url,
                visibility: "public"
            });
        } else {
            // Private URL only needs to be unique for this user
            existingUrl = await urlModel.findOne({
                fullUrl: url,
                visibility: "private",
                user: userId
            });
        }

        if (existingUrl) {
            return res.status(409).json({
                message: "Url already exists",
                shortUrl: existingUrl.shortUrl
            });
        }

        const shortUrl = await urlModel.create({
            fullUrl: url,
            visibility: visibility || "public",
            user: userId,
        });
        res.status(201).json({ message: "Url created successfully", shortUrl: shortUrl.shortUrl });
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const getAllUrl = async (req: AuthenticatedRequest, res: express.Response) => {
    try {
        const { limit, cursor } = req.query;
        const parsedLimit = typeof limit === "string" ? parseInt(limit, 10) : NaN;
        const pageLimit = Number.isFinite(parsedLimit) && parsedLimit > 0
            ? Math.min(parsedLimit, 7)
            : 7;

        const query: any = { visibility: "public" };

        if (cursor && typeof cursor === "string") {
            if (!mongoose.isValidObjectId(cursor)) {
                return res.status(400).json({ message: "Invalid cursor" });
            }
            query._id = { $gt: cursor };
        }

        const shortUrls = await urlModel
            .find(query)
            .sort({ _id: 1 })
            .populate("user", "username")
            .lean()
            .limit(pageLimit);

        if (shortUrls.length <= 0) {
            return res.status(200).json({ publicLinks: [], cursor: null });
        }

        const publicLinks = shortUrls.map(({ user, ...link }) => ({
            ...link,
            username: user && typeof user === "object" && "username" in user
                ? user.username
                : "Unknown user",
        }));

        const newCursor = publicLinks.length > 0 ? publicLinks[publicLinks.length - 1]._id : null;

        return res.status(200).send({publicLinks: publicLinks, cursor: newCursor});
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

const getUserUrls = async (req: AuthenticatedRequest, res: express.Response) => {
    try {
        const userId = getUserId(req);
        if(!userId) return res.status(401).json({ message: "Unauthorized" });
        const shortUrls = await urlModel.find({ user: userId });

        return res.status(200).send(shortUrls);
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const redirectUrl = async (req: AuthenticatedRequest, res: express.Response) => {
    try {
        const shortUrlId = req.params.id;
        if (!shortUrlId) return res.status(400).json({ message: "something went wrong" });

        const userId = getUserId(req);
        if(!userId) return res.status(401).json({ message: "Unauthorized" });
        
        const shortUrl = await urlModel.findOne({
            _id: shortUrlId,
            $or: [{ user: userId, visibility: "private" }, { visibility: "public" }]
        });
        
        if (!shortUrl) return res.status(404).json({ message: "Full url not found" });

        shortUrl.clicks++;
        await shortUrl.save();

        return res.redirect(`${shortUrl.fullUrl}`);
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


const deleteUrl = async (req: AuthenticatedRequest, res: express.Response) => {
    try {
        const shortUrlId = req.params.id;
        if (!shortUrlId) return res.status(400).json({ message: "something went wrong" });

        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const shortUrl = await urlModel.findOneAndDelete({ _id: shortUrlId, user: userId });
        if (!shortUrl) return res.status(400).json({ message: "Something wrong about url" });
        
        return res.status(200).json({ message: "Full url deleted" });
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export {
    createUrl,
    getAllUrl,
    redirectUrl,
    deleteUrl,
    getUserUrls,
};