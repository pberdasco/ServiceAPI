import { showError } from "../middleware/controllerErrors.js";
import AuthService from "../services/auth_service.js";

export default class AuthController{
    static async userRegister(req, res, next) {
        const user = req.body;   //user: {nombre, email, password} 
        try{
            const insertado = await AuthService.userRegister(user);
            res.status(200).send(insertado.toJson());
        } catch (error){
            // ver si capturo especialmente el "ya existe"
            showError(req, res, error);
        }
        

    }

    static async userLogin(req, res, next) {
        res.send("Login de usuario");
    }
}

// Ver minutos 1:18:23 en https://www.youtube.com/watch?v=T1QFGwOnQxQ