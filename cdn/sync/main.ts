// import express, { Express, Request, Response } from "express";
// import config from "./config/config";
// import { sync } from "./sync";

// const app: Express = express();

// app.get("/", async (req: Request, res: Response) => await sync());

// app.listen(config.port, () => {});

/**
 * Seems to break the Vercel build by not being able to find the express package.
 * We're not even building this in prod so keep it commented.
 * Uncomment when the syncing needs to happen
 */
