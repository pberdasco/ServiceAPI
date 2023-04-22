import { showError } from "../middleware/controllerErrors.js";
import CasoService from "../services/casos_service.js";

export default class CasoController {

    static async getAll(req, res, next) {
        try {
            const casos = await CasoService.getAll();
            res.status(200).send(casos);                  
        } catch (error) {
            showError(req, res, error);
        }
    }

    // static async getAllByTipoId(req, res, next) {
    //     const id = req.params.id;
    //     if(isNaN(id))
    //         res.status(400).send({message: "El tipoId debe ser numerico"});
    //     else{
    //         try {
    //             const casos = await CasoService.getAllByTipoId(id);
    //             res.status(200).send(casos);                  
    //         } catch (error) {
    //             res.status(error?.status || 500).send({message: error?.message || error});     
    //         }
    //     }
    // }

    static async getById(req, res, next) {
        const id = req.params.id;
        if(isNaN(id))
            res.status(400).send({message: "El id debe ser numerico"});
        else{
            try{
                const caso = await CasoService.getById(id);
                res.status(200).send(caso.toJson());
            } catch (error){
                showError(req, res, error);
            }
        } 
    }


    static async create(req, res, next) {
        const nuevoCaso = req.body;
        const errores = CasoController.bodyValidations(nuevoCaso, "create")
        if (errores.length === 0){
            try{
                const insertado = await CasoService.create(nuevoCaso);
                res.status(200).send(insertado.toJson());
            } catch (error){
                showError(req, res, error);
            }
        }else{
            const error = {message: "Problemas con el req.body", fields: errores}
            res.status(400).send(error)
        }
    }

    static async delete(req, res, next) {
        const id = req.params.id;
        try{
            const ok = await CasoService.delete(id);
            res.status(204).send("Ok")
        } catch (error){
            res.status(error?.status || 500).send({message: error?.message || error});
        }
    }

    static async update(req, res, next) {
        const id = req.params.id;
        const caso = req.body;
        const errores = CasoController.bodyValidations(caso, "update")
        if (errores.length === 0){
            try{
                const casoActualizado = await CasoService.update(id, caso);
                res.status(200).send(casoActualizado.toJson());
            } catch (error){
                res.status(error?.status || 500).send({message: error?.message || error});
            }
        }else{
            const error = {message: "Problemas con el req.body", fields: errores}
            res.status(400).send(error)
        }
    }

    static bodyValidations(record, method){
        const errores = [];
        return errores;

        //TODO: hacer una validacion correcta.
        let allowedProperties;
        let allowedItemProperties;
        if (method === "create"){
            allowedProperties = ["tipoProductoId", "idERP", "nombre", "serviceable"]
            allowedItemProperties = [""]
            if (isNaN(record?.tipoProductoId))
                errores.push("tipoProductoId debe ser numerico");
            if(!record.idERP)
                errores.push("falta idERP");
            if (!record.nombre)
                errores.push("falta nombre")

            if (!record.items || !Array.isArray(record.items) || record.items.length === 0) {
                errores.push("Debe incluir al menos un registro en la propiedad 'items'");
            } else {
                for (const item of record.items) {
                    if (!item.hasOwnProperty("deposito") || !item.hasOwnProperty("cantidad")) {
                    errores.push("Cada registro de la propiedad 'items' debe tener los atributos 'deposito' y 'cantidad'");
                    break;
                    }
                }
            }
                  
        }else{
            allowedProperties = ["tipoProductoId", "idERP", "nombre", "serviceable"]
        }
        const properties = Object.keys(record);
        if (!properties.every(property => allowedProperties.includes(property)))
            errores.push("Se recibieron propiedades que no corresponden");
        
        return errores;
    }
}