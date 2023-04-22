// instalar 
//    bcryptjs      (encriptacion de clave)
//    jsonwebtoken  (jwt)

// Header -> Authorization -> Bearer "token"


export function checkJwt(req, res, next){
    try{
        const jwtByUser = req.headers.authorization || "" ;
        const jwt = jwtByUser.split(" ").pop();  // separar "bearer token" y quedarnos con el token
        const isOk = true;
        console.log("jwtOk")
        //const isOk = valiarjwt(jwt, JWT_SECRET,...)
        if (!isOk)
            res.status(401).send("Session invalida. JWT invalido")
        else   
            next();
    }catch(error){
        res.status(400).send("Session invalida")
    }
}
