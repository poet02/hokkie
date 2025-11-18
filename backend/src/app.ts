import express from "express";
import logger from "morgan";
import {dbSync} from "./db/connection";
import cors from "cors";
import { customRequest } from "./types/customDefinition";
import { deserializeUser } from "./middleware";
import appRouter from "./routes/v1";
import { errorHandler } from "./middleware/error";

// Create Express server
const app = express();

// Optional request header logger. Enable by setting `DEBUG_REQ=true` in your environment.
if (process.env.DEBUG_REQ === "true") {
  app.use((req, _res, next) => {
    try {
      console.debug("[req-debug]", req.method, req.originalUrl);
      const headers = {
        host: req.headers.host,
        connection: req.headers.connection,
        upgrade: req.headers.upgrade,
        "user-agent": req.headers["user-agent"],
        "content-type": req.headers["content-type"],
      };
      console.debug("[req-headers]", JSON.stringify(headers));
    } catch (err) {
      /* ignore logging errors */
      console.error("Error logging request headers:", err);
    }
    next();
  });
}

app.use(logger("dev"));
app.set("port", process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(deserializeUser);

/**
 * Primary app routes.
 */

app.use("/api/v1", appRouter);

/**
 * route to test server
 */

app.get("/api/", (req: customRequest, res) => {
  res.status(200).json({ msg: "server is up..", user: req.user });
});

/**
 * route to sync db
 */
app.patch("/api/sync", async (req, res) => {
  try {
    const sync = await dbSync();
    res.status(200).json({ ...sync, error: false });
  } catch (err) {
    console.log("ERR", err);
    let msg = "Internal Server Error";
    if (err instanceof Error) {
      msg = err.message;
    } else if (err) {
      msg = err;
    }
    return res.status(400).json({ errorMsg: msg, error: true });
  }
});


app.use(errorHandler);
export default app;
