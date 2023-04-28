import { showError } from "../middleware/controllerErrors.js";
import EstadoItemService from "../services/estadoItem_service.js";

export default class EstadoItemController {

    static async getAll(req, res, next) {
        try {
            const estados = await EstadoItemService.getAll();
            res.status(200).send(estados);                  
        } catch (error) {
            showError(req, res, error);    
        }
    }
}