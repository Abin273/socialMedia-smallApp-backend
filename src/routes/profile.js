import express from "express";
import { authUser } from "../middlewares/auth.js";
import { validateEditProfileData } from "../util/validation.js";

const router = express.Router();

router.get("/view", authUser, async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({ message: "User profile", data: user });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

router.patch("/edit", authUser, async (req, res) => {
	const user = req.user;
	const editData = req.body
	try {
	  if (!validateEditProfileData(editData)) throw new Error("Invalid Edit Request");
	  
	  Object.keys(editData).forEach((key) => (user[key] = req.body[key]));
  
	  await user.save();
  
	  res.json({
		message: `${user.firstName}, your profile updated successfuly`,
		data: user,
	  });
	} catch (error) {
	  res.status(500).json({error: true, message:error.message});
	}
  });

export default router;
