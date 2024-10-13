import express from "express";
import { authUser } from "../middlewares/auth.js";
import ConnectionRequestModel from "../models/connectionRequest.js";

const router = express.Router();
const USER_SAFE_FIELDS = [
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
            .populate("fromUserId", USER_SAFE_FIELDS);

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
            .populate("fromUserId", USER_SAFE_FIELDS)
            .populate("toUserId", USER_SAFE_FIELDS);

        // To remove the details of current loggened user from the result data
        const data = connections.map((connection) => {
            if (connection.fromUserId._id.toString() === currentUser._id.toString()) {
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

export default router;
