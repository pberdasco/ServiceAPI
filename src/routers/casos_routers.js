import { Router } from "express";
import CasoController from "../controllers/casos_controller.js";
//import { logRequest } from "../middleware/logRequest.js";
//import { checkJwt } from "../middleware/session.js";

export const casoRouter = Router();

casoRouter.get("/", CasoController.getAll);
casoRouter.get("/:id", CasoController.getById);
casoRouter.post("/", CasoController.create);
// casoRouter.post('/', logRequest, checkJwt, CasoController.create);
casoRouter.put("/:id", CasoController.updateCabecera);

casoRouter.get("/Item/:id", CasoController.getItemById);
casoRouter.put("/Item/:id", CasoController.updateItem);


/* Proximos:
router.put('/:id', CasoController.update);
//router.put('/ITEM/:id', CasoController.update);


router.delete('/:id', CasoController.delete);

//Otros:

// get, post y put para items?

// get con filtros
// router.get('/F/', CasoController.getAllFiltered) y mandar filtros estado[]=1&estado[]=3 ....

*/

