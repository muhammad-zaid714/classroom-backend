import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from '../db/index.js' // your drizzle instance
import * as schema from '../db/schema/auth.js' // your drizzle schema   
import { allowedOrigins } from '../config/origins.js';

export const auth = betterAuth({
    secret:process.env.BETTER_AUTH_SECRET!,
    trustedOrigins: allowedOrigins,
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema,
    }),
    emailAndPassword:{
        enabled: true,
    },
    user:{
        additionalFields: {
            role: {
                type: "string",required: true,defaultValue:      "student",input:true
            },imageCldPubId: {
                type: "string",required: false,input:true

            }
        }
    }
});