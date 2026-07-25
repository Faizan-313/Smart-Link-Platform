import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    refreshToken?: string;

    isPasswordCorrect(password: string): Promise<boolean>;

    generateAccessToken(): string;

    generateRefreshToken(): string;
}

const UserSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: { 
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
    }
},{
    timestamps: true
});

UserSchema.pre("save", async function () {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
});

UserSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.generateAccessToken = async function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            algorithm: "HS256",
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"]
        }
    )
}

UserSchema.methods.generateRefreshToken = async function (){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            algorithm: "HS256",
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"]
        }
    )
}

export const userModel = mongoose.model("User", UserSchema);