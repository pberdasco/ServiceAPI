/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import { showError } from "../middleware/controllerErrors.js";
import ClientesService from "../services/clientes_service.js";

export default class ClienteController {

    static async getAll(req, res, next) {
        try {
            const clientes = await ClientesService.getAll();
            res.status(200).send(clientes);                  
        } catch (error) {
            showError(req, res, error);    
        }
    }

    static async getById(req, res, next) {
        const id = req.params.id;
        if(isNaN(id))
            res.status(400).send({message: "El id debe ser numerico."});
        else{
            try{
                const cliente = await ClientesService.getById(id, "id");
                res.status(200).send(cliente.toJson());
            } catch (error){
                showError(req, res, error);
            }
        } 
    }


    static async getByEmail(req, res, next) {
        const email = req.params.email;
        try{
            const cliente = await ClientesService.getByEmail(email);
            res.status(200).send(cliente.toJson());
        } catch (error){
            showError(req, res, error);
        }
    }


    static async create(req, res, next) {
        const nuevoCliente = req.body;
        //const errores = ClienteController.bodyValidations(nuevoCliente, "create")
        //if (errores.length === 0){
            try{
                const insertado = await ClientesService.create(nuevoCliente);
                res.status(200).send(insertado.toJson());
            } catch (error){
                showError(req, res, error);
            }
        //}else{
        //    const error = {message: "Problemas con el req.body", fields: errores}
        //    res.status(400).send(error)
       // }
    }

    static async delete(req, res, next) {
        const id = req.params.id;
        try{
            const ok = await ClientesService.delete(id);
            res.status(204).send(ok);
        } catch (error){
            showError(req, res, error);
        }
    }

    static async update(req, res, next) {
        const id = req.params.id;
        const cliente = req.body;
        //const errores = ClienteController.bodyValidations(cliente, "update")
        // if (errores.length === 0){
            try{
                const productoActualizado = await ClientesService.update(id, cliente);
                res.status(200).send(productoActualizado.toJson());
            } catch (error){
                showError(req, res, error);
            }
        // }else{
        //     const error = {message: "Problemas con el req.body", fields: errores}
        //     res.status(400).send(error)
        // }
    }

//     static bodyValidations(record, method){
//         //TODO: probar con la libreria "jsonschema"
//         const errores = [];
//         let allowedProperties;
//         if (method === "create"){
//             allowedProperties = ["tipoProductoId", "idERP", "nombre", "serviceable"]
//             if (isNaN(record?.tipoProductoId))
//                 errores.push("tipoProductoId debe ser numerico");
//             if(!record.idERP)
//                 errores.push("falta idERP");
//             if (!record.nombre)
//                 errores.push("falta nombre")
//         }else{
//             allowedProperties = ["tipoProductoId", "idERP", "nombre", "serviceable"]
//         }
//         const properties = Object.keys(record);
//         if (!properties.every(property => allowedProperties.includes(property)))
//             errores.push("Se recibieron propiedades que no corresponden");
        
//         return errores;
//     }
}