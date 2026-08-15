import express from "express";
import {userModel} from "../models/user.model";
import { AuthenticatedRequest } from "../types/main.types";
import jwt from "jsonwebtoken";

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
        const createdUser = await userModel.findById(newUser._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            return res.status(500).json({ message: "Something went wrong" })
        }
        return res.status(201).json({ message: "User registered successfully" , user: { id: newUser._id, username: newUser.username, email: newUser.email } });
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

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);

        return res.status(200).json({ message: "User logged in successfully", user: { id: user._id, username: user.username, email: user.email, role: "user" }});
    } catch (error) {
        console.log("Error --> ", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const logoutUser = async (req: AuthenticatedRequest, res: express.Response) => {
    try {
        await userModel.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    refreshToken: undefined
                }
            },{
                new: true
            }
        )
        return res.status(200).clearCookie( 'accessToken', options ).clearCookie( 'refreshToken', options).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout: ", error)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

const refreshUserToken = async (req: AuthenticatedRequest, res: express.Response) => {
    try {
        const incommingRefreshToken: string = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "").trim();
        if(!incommingRefreshToken) return res.status(401).json({ message: "Unauthorized" });

        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET as string, { algorithms: ["HS256"] });
        if(typeof decodedToken === "string") return res.status(401).json({ message: "Invalid token" });
        
        const user = await userModel.findById(decodedToken.user._id);
        if(!user) return res.status(401).json({ message: "invalid token" })

        if( incommingRefreshToken !== user?.refreshToken ){
            return res.status(401).json({ message: "token is expired or used" })
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        res.cookie("accessToken", accessToken, options);
        res.cookie("refreshToken", refreshToken, options);

        return res.status(200);

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