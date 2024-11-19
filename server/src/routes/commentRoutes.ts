import { Router } from "express";
import { createComment, getComments } from "../controllers/commentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createComment);
router.get("/:postId", authMiddleware, getComments);

export default router;
