import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.js";
import profileRoute from "./routes/profile.js";
import requestRoute from "./routes/request.js";
import userRoute from "./routes/user.js";
import { BASE_URL } from "./util/constants.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(cookieParser())

// ROUTES
app.use(`${BASE_URL}/auth`, authRoute);
app.use(`${BASE_URL}/profile`, profileRoute);
app.use(`${BASE_URL}/request`, requestRoute); // routes for connection requests
app.use(`${BASE_URL}/user`, userRoute);

export { app };
