import { showError } from "../middleware/controllerErrors.js";
import StatusDatosService from "../services/statusDatos_service.js";

export default class StatusDatosController {

    static async getAll(req, res, next) {
        try {
            const estados = await StatusDatosService.getAll();
            res.status(200).send(estados);                  
        } catch (error) {
            showError(req, res, error);    
        }
    }
}