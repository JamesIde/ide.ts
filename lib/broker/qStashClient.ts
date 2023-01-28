import { Client } from "@upstash/qstash";

const broker = new Client({
  token: process.env.QSTASH_CLIENT_TOKEN as string,
});

export default broker;
