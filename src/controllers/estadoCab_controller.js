import { showError } from "../middleware/controllerErrors.js";
import EstadoCabService from "../services/estadoCab_service.js";

export default class EstadoCabController {

    static async getAll(req, res, next) {
        try {
            const estados = await EstadoCabService.getAll();
            res.status(200).send(estados);                  
        } catch (error) {
            showError(req, res, error);    
        }
    }
}