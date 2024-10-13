import express from "express";
import { validateSignUpData } from "../util/validation.js";
import { comparePassword, generateHashedPassword } from "../util/password.js";
import UserModel from "../models/user.js";
import { COOKIE_EXPIRY_TIME } from "../util/constants.js";
import { createJwtToken } from "../util/jwt.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        // Validation of data
        validateSignUpData(req);
        const { firstName, lastName, email, password } = req.body;
        const existUser = await UserModel.findOne({ email });
        if (existUser) throw new Error("User already exist");
        
        const hashedPassword = await generateHashedPassword(password);

        //   Creating a new instance of the User model
        const user = new UserModel({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await user.save()
        const token = createJwtToken({ userId: user._id });
        res.cookie("token", token, { expires: COOKIE_EXPIRY_TIME });
        res.status(200).json({ message: "Signup success" });
    } catch (error) {
        res.status(400).send({error: true, message: error.message});
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) throw new Error("Invalid credentials");
        
        const isValidPassward = await comparePassword(password, user.password);
        if (!isValidPassward) throw new Error("Invalid credentials");
        const token = createJwtToken({ userId: user._id });

        
        res.cookie("token", token, { expires: COOKIE_EXPIRY_TIME });
        res.status(200).json({ message: "Login success" });
    } catch (error) {
        res.status(400).send({error: true, message: error.message});
    }
});

router.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).json({ message: "Logout successful" });
});

export default router;
