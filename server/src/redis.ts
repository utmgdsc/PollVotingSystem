import { createClient } from "redis";
import fs from "fs";
import path from "path";
import readline from "readline";
const client = createClient({
  url: process.env.REDIS_URL,
});

(async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  console.log("connected to redis");

  const readstream = fs.createReadStream(
    path.join(__dirname, process.env.WHITELIST)
  );

  const rl = readline.createInterface({
    input: readstream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const data = line.split(",");
    console.log(data);
    if (data[1].trim() == "VALID") client.set(data[0].trim(), "instructor");
    else client.del(data[0].trim());
  }
})();

export { client };
