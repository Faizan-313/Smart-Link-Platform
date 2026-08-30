import { urlModel } from "../models/shortUrl.model"
import express from "express"
import mongoose from "mongoose"
import { AuthenticatedRequest } from "../types/main.types";
import { redisClient } from "../config/redis.config";

const getUserId = (req: AuthenticatedRequest) => {
    const user = req.user;
    if (user && typeof user === "object" && "_id" in user) {
        return user._id?.toString();
    }
    return undefined;
};

const resolveClickCount = async (linkId: mongoose.Types.ObjectId | string, dbClicks: number) => {
    const cachedClicks = await redisClient.get(`clicks:${linkId}`);
    return cachedClicks !== null ? parseInt(cachedClicks, 10) : dbClicks;
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
                message: "Url already exists" ,
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

        const publicLinks = await Promise.all(
            shortUrls.map(async ({ user, ...link }) => ({
                ...link,
                clicks: await resolveClickCount(link._id, link.clicks),
                username: user && typeof user === "object" && "username" in user
                    ? user.username
                    : "Unknown user",
            }))
        );

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
        const shortUrls = await urlModel.find({ user: userId }).lean();

        const userLinks = await Promise.all(
            shortUrls.map(async (link) => ({
                ...link,
                clicks: await resolveClickCount(link._id, link.clicks),
            }))
        );

        return res.status(200).send(userLinks);
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

        //before mongodb query check if the url is present in redis cache
        const key = `link:${shortUrlId}`;
        const cachedUrl = await redisClient.hGet(key, "fullUrl");
        if(cachedUrl){
            //update the clicks table in the redis
            const clicksKey = `clicks:${shortUrlId}`;
            await redisClient.incr(clicksKey);

            return res.redirect(`${cachedUrl}`);
        }else{
            const response = await urlModel.findOne({
                _id: shortUrlId,
                $or: [{ user: userId, visibility: "private" }, { visibility: "public" }]
            });
            
            if (!response) return res.status(404).json({ message: "Full url not found" });
            response.clicks++;
            await response.save();

            //if clicks count > 5 and also the link is public then cache it
            if(response.clicks > 5 && response.visibility === "public"){
                const key = `link:${response._id}`;
                const clicksKey = `clicks:${response._id}`;

                const link = {
                    "fullUrl": response.fullUrl || "", 
                    "shortUrl": response.shortUrl,
                    "visibility": response.visibility,
                };

                //add the url to redis cache with an expiration time of 4hr
                await redisClient.hSet(key, link);
                await redisClient.expire(key, 14400); // 4 hours in seconds

                //also add the url to redis clicks count table with same expiration
                await redisClient.set(clicksKey, response.clicks.toString());
                await redisClient.expire(clicksKey, 14400); // 4 hours in seconds
            }

            return res.redirect(`${response.fullUrl}`);
        }
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

        const key = `link:${shortUrlId}`;
        const clicksKey = `clicks:${shortUrlId}`;
        await redisClient.del(key);
        await redisClient.del(clicksKey);
        
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