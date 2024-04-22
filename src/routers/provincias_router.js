import { Router } from "express";
import ProvinciaController from "../controllers/provincias_controller.js";
import { logRequest } from "../middleware/logRequest.js";

export const provinciaRouter = Router();

provinciaRouter.get("/", logRequest(), ProvinciaController.getAll);
