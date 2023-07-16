import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/userAuth.js";

const router = express.Router();

// READ
router.get('/:id', verifyToken, getUser);
router.get('/friends/:id', verifyToken, getUserFriends);

// UPDATE
router.patch('/friendId/:id', verifyToken, addRemoveFriend);

export default router;


