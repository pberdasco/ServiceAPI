import { Router } from "express";
import StatusDatosController from "../controllers/statusDatos_controller.js";
import { logRequest } from "../middleware/logRequest.js";
import { checkJwt } from "../middleware/session.js";

export const statusDatosRouter = Router()

statusDatosRouter.get('/', StatusDatosController.getAll);