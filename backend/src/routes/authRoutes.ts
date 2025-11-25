import express from "express";
import {
  signup,
  signin,
  getCurrentUser,
  signout,
} from "../controllers/authController";
import { auth } from "../middleware/auth";

const router = express.Router();

//public routes
router.post('/signup',signup);
router.post('/signin',signin);

//protected routes - only logged in user with valid JWT token
router.get('/me', auth, getCurrentUser);
router.post('/signout', auth, signout);

export default router;