import { Router } from "express";
import AuthController from "../controllers/auth_controller.js";

const router = Router();

/** http://localhost:5001/auth/register [POST] */
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

export default router;