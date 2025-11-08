// import jwt from "jsonwebtoken"
import { ApiError, catchAsync } from "./error.middleware";

export const isAuthenticated = catchAsync(async(req, res, next) => {
    const token = req.cookies.token

    if(!token){
        throw new ApiError("You are not logged in", 401);
    }

    try {
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        req.id = decoded.userId;
        next()
    } catch (error) {
        throw new ApiError("JWT Token error", 401)
    }
})