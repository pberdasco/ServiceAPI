import { showError } from "../middleware/controllerErrors.js";
import AuthService from "../services/auth_service.js";

export default class AuthController{
    static async userRegister(req, res, next) {
        const {nombre, mail, password} = req.body;   
        try{
            const usuario = await AuthService.userRegister({nombre, mail, password});
            res.status(200).send(usuario.toJson());
        } catch (error){
            showError(req, res, error);
        }
    }

    static async userLogin(req, res, next) {
        const {mail, password} = req.body;  
        try {
            const data = await AuthService.userLogin(mail, password);
            res.status(200).send(data);                  
        } catch (error) {
            showError(req, res, error);    
        }
    }

    static async getAll(req, res, next) {
        try {
            const usuarios = await AuthService.getAll();
            res.status(200).send(usuarios);                  
        } catch (error) {
            showError(req, res, error);    
        }
    }

    static async delete(req, res, next) {
        const id = req.params.id;
        try{
            const ok = await AuthService.delete(id);
            res.status(204).send("Ok")
        } catch (error){
            showError(req, res, error);
        }
    }

}
