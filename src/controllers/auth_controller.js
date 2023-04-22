// import AuthService from "../services/auth_service.js";

export default class AuthController{
    static async register(req, res, next) {
        res.send("Registrando usuario");
    }

    static async login(req, res, next) {
        res.send("Login de usuario");
    }
}

// Ver minutos 1:18:23 en https://www.youtube.com/watch?v=T1QFGwOnQxQ