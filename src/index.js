import "./webSocketServer.js";
import { startDatabase } from "./databaseServer.js";
import { startServer } from "./server.js";

startDatabase();
startServer();
