import express, { Express, Request, Response } from "express";
import config from "./config/config";
import { sync } from "./sync";

const app: Express = express();

app.get("/", async (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
  await sync();
});

app.listen(config.port, () => {});
