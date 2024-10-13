import dotenv from "dotenv";
dotenv.config();

import { connectDb } from "./config/db.connect.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8080;
await connectDb();
app.listen(PORT, () => {
    console.log(`Server Started at http//:localhost${PORT}`);
});
