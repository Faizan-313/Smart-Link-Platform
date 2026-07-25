import express from "express"
import {userModel} from "../models/user.model"

const isProduction = process.env.NODE_ENV === "production";

const options: express.CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
}

const registerUser = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;
        if([username, email, password].some((field) => !field || field.trim() === "")){
            return res.status(400).json({ message: "All fields is required" })
        }

        const alreadyExistUser = await userModel.findOne({ email });
        if(alreadyExistUser) return res.status(409).json({ message: "User already exist" });

        const newUser = await userModel.create({ username, email, password });
        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const loginUser = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if([email, password].some((field) => !field || field.trim() === "")){
            return res.status(400).json({ message: "All fields is required" })
        }

        const user = await userModel.findOne({ email });
        if(!user) return res.status(404).json({ message: "User not found" });
        
        const isPasswordValid = await user.isPasswordCorrect(password);
        if(!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);

        return res.status(200).json({ message: "User logged in successfully" });
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const logoutUser = async (req: express.Request, res: express.Response) => {
    try {
        
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const refreshUserToken = async (req: express.Request, res: express.Response) => {
    try {
        
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshUserToken
}