/* eslint-disable no-unused-vars */
// instalar 
//    bcrypt        (encriptacion de clave)
//    jsonwebtoken  (jwt)

// Header -> Authorization -> Bearer "token"
import JWT from "./jwt_handle.js";

export function checkJwt(req, res, next){
    try{
        const jwtByUser = req.headers.authorization || "" ;
        const jwt = jwtByUser.split(" ").pop();  // separar "bearer token" y quedarnos con el token

        const jwtContent = JWT.verifyToken(jwt);
        // Devuelve : { mail: 'p.berdasco@gmail.com', iat: 1682194139, exp: 1682201339 } 
        // incluso se le puede agregar al req algo de info para que le llegue al proximo paso (middleware o final)
        // por ejemplo req.user = {mail: jwtContent.mail}
        // si se le pasa al proximo middleware que es un logger, puede logear al usuario
        // si se le pasa en la cadena a un middleware que es un contador de accesos, puede contar por usuario
        // si le llega a final con un array de autorizaciones puede ver si devuelve o no devuelve datos / realiza la operacion

        // eventualmente aqui tambien se puede hacer alguna valiacion generica
        // if (jwtContent.id != habilitado)
        //     res.status(401).send("Session invalida. JWT invalido")
        // else   
        next();
    }catch(error){
        res.status(400).send("Session invalida. " + error);
    }
}
