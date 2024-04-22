import { Router } from "express";
import ClienteController from "../controllers/clientes_controller.js";
import { logRequest } from "../middleware/logRequest.js";
//import { checkJwt } from "../middleware/session.js";

export const clienteRouter = Router();

clienteRouter.get("/", logRequest(), ClienteController.getAll);
// productoRouter.get('/', logRequest, checkJwt, ProductoController.getAll);

clienteRouter.get("/:id", logRequest(), ClienteController.getById);

clienteRouter.get("/email/:email", logRequest(), ClienteController.getByEmail);

clienteRouter.post("/", logRequest(), ClienteController.create);

clienteRouter.put("/:id", logRequest(), ClienteController.update);

clienteRouter.delete("/:id", logRequest(), ClienteController.delete);

