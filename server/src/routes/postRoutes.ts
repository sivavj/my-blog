import { Router } from "express";
import { createPost, getPosts } from "../controllers/postController";
import { authMiddleware } from "../middleware/authMiddleware";
import upload  from "../utils/fileUpload";

const router = Router();

// Get posts
router.get("/", authMiddleware, getPosts);

// Create a new post
router.post("/", authMiddleware, upload.single("image"), createPost);

export default router;
