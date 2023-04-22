import { Router } from "express";
import AuthController from "../controllers/auth_controller.js";

export const authRouter = Router();

/** http://localhost:5001/auth/register [POST] */
authRouter.post('/register', AuthController.userRegister);
authRouter.post('/login', AuthController.userLogin);

