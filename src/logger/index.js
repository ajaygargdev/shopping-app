import { fileURLToPath } from "url";
import { format } from "date-fns";
import { v4 } from "uuid";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logEvents = async (message, logName = "errLog.txt") => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${v4()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "/", "logs"))) {
      await fs.promises.mkdir(path.join(__dirname, "/", "logs"));
    }
    await fs.promises.appendFile(
      path.join(__dirname, "/", "logs", logName),
      logItem
    );
  } catch (err) {
    console.log("--logEvents:catch-error--", err);
  }
};

export const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  next();
};

export const errorlogger = (err, req, res, next) => {
  logEvents(
    `${req.method}\t${req.headers.origin}\t${req.url}\n${(
      err?.stack || ""
    ).toString()}`,
    "errLog.txt"
  );
  res.status(500).send(err.message);
};
