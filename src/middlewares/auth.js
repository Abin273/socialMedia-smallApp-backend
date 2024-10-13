import { verifyJwtToken } from "../util/jwt";
import UserModel from "../models/user";

export const verifyToken = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) return res.status(401).send("You are not authorized");

        const decodedObj = verifyJwtToken(token);
        const { _id } = decodedObj;

        const user = await UserModel.findById(_id);
        if (!user) throw new Error("User not found");

        req.user = verified;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
