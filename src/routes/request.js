import express from "express";
import { authUser } from "../middlewares/auth.js";
import UserModel from "../models/user.js";
import ConnectionRequestModel from "../models/connectionRequest.js";
import { validateObjectId } from "../util/validation.js";
import { REVIEW_REQUEST_STATUSES, SEND_REQUEST_STATUSES } from "../util/constants.js";

const router = express.Router();

router.post("/send/:status/:toUserId", authUser, async (req, res) => {
    try {
        const { user } = req;
        const fromUserId = req.user._id;
        const { toUserId, status } = req.params;

        const isValidObjectId = validateObjectId(toUserId);
        if (!isValidObjectId)
            throw new Error("Given 'toUserId' is not a valid objectId");

        const allowedStatus = [
            SEND_REQUEST_STATUSES.IGNORED,
            SEND_REQUEST_STATUSES.INTERESTED,
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                error: true,
                message: "Invalid status type: " + status,
            });
        }

        if (user._id.toString() === toUserId)
            throw new Error("You cannot send connection request to yourself");
        const toUser = await UserModel.findById(toUserId);
        if (!toUser) throw new Error("Receiver user not found");

        // To check whether already send the request or not
        const existingConnectionRequest = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        console.log(existingConnectionRequest);

        if (existingConnectionRequest) {
            return res
                .status(400)
                .send({ message: "Connection Request Already Exists!!" });
        }

        const connectionRequest = await new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();

        res.json({
            message: `${req.user.firstName} ${
                status === allowedStatus[1] && "is"
            } ${status} ${status === allowedStatus[1] && "in"} ${
                toUser.firstName
            }`,
            data,
        });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

router.post("/review/:status/:requestId", authUser, async (req, res) => {
    try {
        const { user } = req;
        const { status, requestId } = req.params;

        const isValidObjectId = validateObjectId(requestId);
        if (!isValidObjectId)
            throw new Error("Given 'requestId' is not a valid objectId");
        const allowedStatus = [REVIEW_REQUEST_STATUSES.ACCEPTED, REVIEW_REQUEST_STATUSES.REJECTED];
        if (!allowedStatus.includes(status)) {
            return res
                .status(400)
                .json({ message: "Invalid status type: " + status });
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            toUserId: user._id,
            status: SEND_REQUEST_STATUSES.INTERESTED,
        });
        if (!connectionRequest) {
            return res
                .status(404)
                .json({ message: "Connection request not found" });
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save();

        res.json({ message: `Connection request ${status}`, data });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

export default router;
