import { Router } from "express";
import ProductoController from "../controllers/productos_controller.js";

const router = Router()

router.get('/', ProductoController.getAll);

router.get('/TP/:id', ProductoController.getAllByTipoId);

router.get('/:id', ProductoController.getById);

router.get('/ERP/:id', ProductoController.getByIdERP);

router.post('/', ProductoController.create);

router.put('/:id', ProductoController.update);

router.delete('/:id', ProductoController.delete);

export default router;
