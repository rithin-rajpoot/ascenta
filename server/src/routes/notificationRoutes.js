import { Router } from "express";
import {
  getNotifications,
  getUnread,
  markRead,
  markAllRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Notifications are available to every authenticated user.
router.use(protect);

router.get("/", getNotifications);
router.get("/unread", getUnread);
router.put("/read-all", markAllRead);
router.put("/:id/read", markRead);

export default router;