import { ArcjetNodeRequest, slidingWindow } from "@arcjet/node";
import type {Request,Response, NextFunction } from "express";
import aj from "../config/arcjet";
const securityMiddleware = async (req:Request, res:Response, next:NextFunction) => {
    if(process.env.NODE_ENV === "test") return next();
    try {
        const role:RateLimitRole=req.user?.role ?? 'guest';
        let limit : number;
        let message : string;
        switch(role){
            case 'admin':
                limit = 20;
                message = "Admin rate limit exceeded(20 per min)";
                break;
            case 'teacher':
            case 'student':
                limit = 10;
                message = "Teacher rate limit exceeded(10 per min).Slow down!";
                break;
            default:
                limit = 5;
                message = "Guest rate limit exceeded(5 per min). Please log in for a better experience!";
                break;
        }
        const client = aj.withRule(slidingWindow({
            mode:"LIVE",
            interval:60,
            max:limit,
        }))

        const arcjetRequest:ArcjetNodeRequest = {
            headers: req.headers,
            method: req.method,
            url: req.originalUrl ?? req.url,
            socket: {remoteAddress:req.socket.remoteAddress ??req.ip?? "0.0.0.0"} as any,
        }
        const decision = await client.protect(arcjetRequest)
        if(decision.isDenied() && decision.reason.isBot()) {
            return res.status(403).json({ error: "Access denied", message: "Automatic traffic is not allowed" });
        }
        if(decision.isDenied() && decision.reason.isShield()) {
            return res.status(403).json({ error: "Access denied", message: "Your request was blocked by our security system" });
        }
        if(decision.isDenied() && decision.reason.isRateLimit()) {
            return res.status(429).json({ error: "Rate limit exceeded", message });
        }
        next();
    } catch (error) {
        console.error("Security middleware error:", error);
        res.status(500).json({ error: "Internal server error", message: "Security middleware error" });
        
    }
}
export default securityMiddleware;