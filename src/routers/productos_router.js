import { Router } from "express";
import ProductoController from "../controllers/productos_controller.js";
import { logRequest } from "../middleware/logRequest.js";
// import { checkJwt } from "../middleware/session.js";

export const productoRouter = Router();

productoRouter.get("/", logRequest(), ProductoController.getAll);
// productoRouter.get('/', logRequest, checkJwt, ProductoController.getAll);

productoRouter.get("/TP/:id", ProductoController.getAllByTipoId);

productoRouter.get("/:id", ProductoController.getById);

productoRouter.get("/ERP/:id", ProductoController.getByIdERP);

productoRouter.post("/", ProductoController.create);

productoRouter.put("/:id", ProductoController.update);

productoRouter.delete("/:id", ProductoController.delete);

