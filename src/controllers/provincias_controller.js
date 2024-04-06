/* eslint-disable no-unused-vars */
import { showError } from "../middleware/controllerErrors.js";
import ProvinciaService from "../services/provincias_service.js";

export default class ProvinciaController {

    static async getAll(req, res, next) {
        try {
            const provincias = await ProvinciaService.getAll();
            res.status(200).send(provincias);                  
        } catch (error) {
            showError(req, res, error);    
        }
    }
}