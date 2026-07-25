import express from "express"
import { type JwtPayload } from "jsonwebtoken"

interface AuthenticatedRequest extends express.Request {
    user?: JwtPayload & { _id?: string | unknown; email?: string };
}

export {
    AuthenticatedRequest
}