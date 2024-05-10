import { Router } from "express";
import { logRequest } from "../middleware/logRequest.js";
import AuthController from "../controllers/auth_controller.js";

export const authRouter = Router();

/** http://localhost:5001/auth/register [POST] */
authRouter.put("/", logRequest(), AuthController.userUpdate);
authRouter.post("/register", logRequest(), AuthController.userRegister);
authRouter.post("/login", AuthController.userLogin);
authRouter.get("/", logRequest(), AuthController.getAll);
authRouter.get("/:id", logRequest(), AuthController.getById);
authRouter.delete("/:id", logRequest(), AuthController.delete);

