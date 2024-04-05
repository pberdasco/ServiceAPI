import config from "../config.js";

/*
*  Ejemplo de un middleware de logging, 
*     pero que puede ser cualquier cosa que quiera ejecutar 
*     desde el router antes del controler
*
*  En un middleware como este podriamos contar tambien llamadas, seguridad, etc
*/
export function logRequest(req, res, next){
    //LOGREQUEST: 1= long, 2 = short, other = none.
    if (config.LOGREQUEST === "1" || config.LOGREQUEST === "2"){
        const expressReq = {
            time: new Date(),
            method: req.method,
            url: `http://${req.hostname}:${req.socket.localPort}${req.originalUrl}`,
            params: req.params,
        };
        if (config.LOGREQUEST === "1"){
            expressReq.query= req.query;
            expressReq.userAgent= req.headers["user-agent"];
            expressReq.contentType= req.headers["content-type"];
            expressReq.autorizacion= req.headers["authorization"];
            expressReq.body= req.body;
        }
        console.log("Log: ", expressReq);
    }
    next();
}