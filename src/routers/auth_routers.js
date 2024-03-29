import { Router } from "express";
import { logRequest } from "../middleware/logRequest.js";
import AuthController from "../controllers/auth_controller.js";

export const authRouter = Router();

/** http://localhost:5001/auth/register [POST] */
authRouter.post('/register', AuthController.userRegister);
authRouter.post('/login', AuthController.userLogin);
authRouter.get('/', logRequest, AuthController.getAll);
authRouter.delete('/:id', AuthController.delete);

