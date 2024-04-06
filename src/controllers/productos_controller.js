/* eslint-disable no-unused-vars */
import { showError } from "../middleware/controllerErrors.js";
import ProductoService from "../services/productos_service.js";

export default class ProductoController {

    static async getAll(req, res, next) {
        try {
            const productos = await ProductoService.getAll();
            res.status(200).send(productos);                  
        } catch (error) {
            showError(req, res, error);    
        }
    }

    static async getAllByTipoId(req, res, next) {
        const id = req.params.id;
        if(isNaN(id))
            res.status(400).send({message: "El tipoId debe ser numerico"});
        else{
            try {
                const productos = await ProductoService.getAllByTipoId(id);
                res.status(200).send(productos);                  
            } catch (error) {
                showError(req, res, error);    
            }
        }
    }

    static async getById(req, res, next) {
        const id = req.params.id;
        if(isNaN(id))
            res.status(400).send({message: "El id debe ser numerico. Quizas quiso usar /ERP/CodigoERP"});
        else{
            try{
                const producto = await ProductoService.get(id, "id");
                res.status(200).send(producto.toJson());
            } catch (error){
                showError(req, res, error);
            }
        } 
    }

    static async getByIdERP(req, res, next) {
        const id = req.params.id;
        try{
            const producto = await ProductoService.get(id, "idERP");
            res.status(200).send(producto.toJson());
        } catch (error){
            showError(req, res, error);
        }
    }


    static async create(req, res, next) {
        const nuevoProducto = req.body;
        const errores = ProductoController.bodyValidations(nuevoProducto, "create");
        if (errores.length === 0){
            try{
                const insertado = await ProductoService.create(nuevoProducto);
                res.status(200).send(insertado.toJson());
            } catch (error){
                showError(req, res, error);
            }
        }else{
            const error = {message: "Problemas con el req.body", fields: errores};
            res.status(400).send(error);
        }
    }

    static async delete(req, res, next) {
        const id = req.params.id;
        try{
            const ok = await ProductoService.delete(id);
            res.status(204).send("Ok");
        } catch (error){
            showError(req, res, error);
        }
    }

    static async update(req, res, next) {
        const id = req.params.id;
        const producto = req.body;
        const errores = ProductoController.bodyValidations(producto, "update");
        if (errores.length === 0){
            try{
                const productoActualizado = await ProductoService.update(id, producto);
                res.status(200).send(productoActualizado.toJson());
            } catch (error){
                showError(req, res, error);
            }
        }else{
            const error = {message: "Problemas con el req.body", fields: errores};
            res.status(400).send(error);
        }
    }

    static bodyValidations(record, method){
        //TODO: probar con la libreria "jsonschema"
        const errores = [];
        let allowedProperties;
        if (method === "create"){
            allowedProperties = ["tipoProductoId", "idERP", "nombre", "serviceable"];
            if (isNaN(record?.tipoProductoId))
                errores.push("tipoProductoId debe ser numerico");
            if(!record.idERP)
                errores.push("falta idERP");
            if (!record.nombre)
                errores.push("falta nombre");
        }else{
            allowedProperties = ["tipoProductoId", "idERP", "nombre", "serviceable"];
        }
        const properties = Object.keys(record);
        if (!properties.every(property => allowedProperties.includes(property)))
            errores.push("Se recibieron propiedades que no corresponden");
        
        return errores;
    }
}