// instalar 
//    bcryptjs      (encriptacion de clave)
//    jsonwebtoken  (jwt)

// Header -> Authorization -> Bearer "token"


export function checkJwt(req, res, next){
    console.log("checkeando jwt. No implementado.");
    next();
    /*
    try{
        const jwtByUser = req.headers.authorization || "";
        const jwt = jwtByUser.split(" ").pop() // lo que esta delante del blanco es "Bearer" y nos quedamos con lo de atras que es el token
        // const isOk = valiarjwt(jwt, JWT_SECRET,...)
        // if (!isOk) res.status(401).send("Session invalida. JWT invalido")
        // else{ next();}
        console.log(jwtByUser);
        next();
    }catch{
        res.status(400);
        res.send("Session invalida")
    }
    */
}
