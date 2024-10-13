import { verifyJwtToken } from "../util/jwt.js";
import UserModel from "../models/user.js";

export const authUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) return res.status(401).send("You are not authorized");

        const decodedObj = verifyJwtToken(token);
        const { userId } = decodedObj;

        const user = await UserModel.findById(userId);
        if (!user) throw new Error("User not found");

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
