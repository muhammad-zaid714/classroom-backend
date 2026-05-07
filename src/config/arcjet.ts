import arcjet, { detectBot, shield, slidingWindow, tokenBucket } from "@arcjet/node";

if(!process.env.ARCJET_KEY && process.env.NODE_ENV !== "development" && process.env.ARCJET_ENV !== "development") {
  throw new Error("ARCJET_KEY environment variable is not set");
}

 const aj = arcjet({
  
  key: process.env.ARCJET_KEY ?? "arcjet_key_placeholder_dev",
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    slidingWindow({
        mode:"LIVE",
        interval:2,
        max:5
    })
  ],
});
export default aj;