import { Router } from "express";
import ClienteController from "../controllers/clientes_controller.js";
import { logRequest } from "../middleware/logRequest.js";
//import { checkJwt } from "../middleware/session.js";

export const clienteRouter = Router();

clienteRouter.get("/", logRequest, ClienteController.getAll);
// productoRouter.get('/', logRequest, checkJwt, ProductoController.getAll);

clienteRouter.get("/:id", ClienteController.getById);

clienteRouter.get("/email/:email", ClienteController.getByEmail);

clienteRouter.post("/", ClienteController.create);

clienteRouter.put("/:id", ClienteController.update);

clienteRouter.delete("/:id", ClienteController.delete);

