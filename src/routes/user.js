import express from "express";
import { authUser } from "../middlewares/auth.js";
import ConnectionRequestModel from "../models/connectionRequest.js";
import UserModel from "../models/user.js";

const router = express.Router();

const USER_SAFE_DATA_FIELDS = [
    "firstName",
    "lastName",
    "photoUrl",
    "age",
    "gender",
    "about",
    "skills",
];

// Get all the pending connection request for the loggedIn user
router.get("/requests/received", authUser, async (req, res) => {
    try {
        const currentUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: currentUser._id,
            status: "interested",
        })
            .select(["fromUserId", "createdAt"])
            .populate("fromUserId", USER_SAFE_DATA_FIELDS);

        res.json({
            message: "Connect requests fetched successfully",
            data: connectionRequests,
        });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// To see connections of current user
router.get("/connections", authUser, async (req, res) => {
    try {
        const currentUser = req.user;
        const connections = await ConnectionRequestModel.find({
            $or: [
                { toUserId: currentUser._id, status: "accepted" },
                { fromUserId: currentUser._id, status: "accepted" },
            ],
        })
            // .select(["fromUserId", "createdAt"])
            .populate("fromUserId", USER_SAFE_DATA_FIELDS)
            .populate("toUserId", USER_SAFE_DATA_FIELDS);

        // To remove the details of current loggened user from the result data
        const data = connections.map((connection) => {
            if (
                connection.fromUserId._id.toString() ===
                currentUser._id.toString()
            ) {
                return connection.toUserId;
            }
            return connection.fromUserId;
        });

        res.json({
            message: "Connections fetched successfully",
            data,
        });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

router.get("/feed", authUser, async (req, res) => {
    try {
        const currentUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { toUserId: currentUser._id },
                { fromUserId: currentUser._id },
            ],
        }).select("fromUserId  toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((request) => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        });

        const users = await UserModel.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: currentUser._id } },
            ],
        })
            .select(USER_SAFE_DATA_FIELDS)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "feed data fetched successfully",
            data: users,
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
