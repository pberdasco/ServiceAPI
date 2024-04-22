import { Router } from "express";
import EstadoItemController from "../controllers/estadoItem_controller.js";
// import { logRequest } from "../middleware/logRequest.js";
// import { checkJwt } from "../middleware/session.js";

export const estadoItemRouter = Router();

estadoItemRouter.get("/", EstadoItemController.getAll);