//  https://jwt.io/
import jwt from "jsonwebtoken";
import config from "../config.js";

export default class JWT{
    // en el jwt mandar datos utiles del usuario (id, email, clienteId?, algun permiso?/claim)
    static generateToken(mail){
        const token = jwt.sign({mail}, config.JWT_SECRET, {expiresIn: "2h"});
        return token;
    }

    static verifyToken(token){
        return jwt.verify(token, config.JWT_SECRET);
    }
}

