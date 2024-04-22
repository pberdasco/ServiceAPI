import { Router } from "express";
import EstadoCabController from "../controllers/estadoCab_controller.js";
import { logRequest } from "../middleware/logRequest.js";
// import { checkJwt } from "../middleware/session.js";

export const estadoCabRouter = Router();

estadoCabRouter.get("/", logRequest(), EstadoCabController.getAll);