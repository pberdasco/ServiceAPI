//  https://jwt.io/
import jwt from "jsonwebtoken";
import config from "../config.js";

export default class JWT{
    /**
     * Genera un token para el usuario
     * @param {object} tokenContent {id, nombre, mail, derechos}
     * @returns {string} token
     */
    static generateToken({id, mail, nombre, derechos}){
        const tokenContent = {id, mail, nombre, derechos};
        const token = jwt.sign(tokenContent, config.JWT_SECRET, {expiresIn: "2h"});
        return token;
    }

    static verifyToken(token){
        return jwt.verify(token, config.JWT_SECRET);
    }
}

