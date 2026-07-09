import { error } from "node:console";
import { urlModel } from "../models/shortUrl.model"
import express from "express"

const createUrl = async (req: express.Request, res: express.Response) => {
    try {
        const url = req.body.fullUrl;
        if(!url) return res.status(400).json({ message: "url is required" });

        const urlFound = await urlModel.find({fullUrl: url});
        if(urlFound.length > 0) return res.status(409).send(urlFound);

        const shortUrl = await urlModel.create({
            fullUrl: url,
        });
        res.status(201).send(shortUrl);
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const getAllUrl = async (req: express.Request, res: express.Response) => {
    try {
        const shortUrls = await urlModel.find();
        if(shortUrls.length <= 0) return res.status(400).json({ message: "short urls not found" });
        return res.status(200).send(shortUrls)
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const getUrl = async (req: express.Request, res: express.Response) => {
    try {
        const shortUrlId = req.params.id;
        if(!shortUrlId) return res.status(400).json({ message: "something went wrong"})

        const shortUrl = await urlModel.findOne({ shortUrl: shortUrlId });
        if(!shortUrl) return res.status(404).json({ message: "Full url not found" });

        shortUrl.clicks++;
        shortUrl.save();

        return res.redirect(`${shortUrl.fullUrl}`);
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const deleteUrl = async (req: express.Request, res: express.Response) => {
    try {
        const shortUrlId = req.params.id;
        if(!shortUrlId) return res.status(400).json({ message: "something went wrong"})
        
        const shortUrl = await urlModel.findByIdAndDelete({_id: shortUrlId});
        if(shortUrl) return res.status(200).json({ message: "Full url deleted" }); 
        return res.status(400).json({ message: "Something wrong about url"})
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export {
    createUrl,
    getAllUrl,
    getUrl,
    deleteUrl
}