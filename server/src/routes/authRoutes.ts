import { Router } from "express";
import { validatePayload } from "../utils/validatePayload";
import { z } from "zod";
import { login, register } from "../controllers/authController";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register endpoint
router.post("/register", validatePayload(registerSchema), register);

// Login endpoint
router.post("/login", validatePayload(loginSchema), login);

export default router;
