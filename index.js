import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";

import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/postController.js"
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import postRoute from "./routes/postRoute.js";
import { verifyToken } from "./middleware/userAuth.js";


// import User from "./models/userModel.js";
// import Post from "./models/postModel.js";
// import {users,posts} from "./data/index2.js"

//CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ extended: "true", limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: "true", limit: "30mb" }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// FILE STOREAGE
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/assets");
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage: storage });

// ROUTES WITH FILES  //we are writing image upload paths here because multer is defined here
app.post("/auth/register", upload.single("picture"), register); 
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/posts", postRoute);

// MONGOOSE SETUP
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Database connected Successfully");
	})
	.catch((error) => {
		console.log(`did not connect..Error:${error}`);
	});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
	console.log(`Server Started at http//:localhost${PORT}`);

    // ADD DUMMY DATA ONE TIME
    // User.insertMany(users);
    // Post.insertMany(posts);
});
