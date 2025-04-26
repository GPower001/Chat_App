import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getUsersForSidebar } from '../controllers/message.contoller.js';
import { getMessages, sendMessage } from '../controllers/message.contoller.js'; // Assuming you have a controller for messages

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages); // Assuming you want to get a specific user by ID
router.post("/send/:id", protectRoute, sendMessage); // Assuming you have a sendMessage function in your controller

export default router;

