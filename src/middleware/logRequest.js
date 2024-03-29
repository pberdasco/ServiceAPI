import config from "../config.js";

/*
*  Ejemplo de un middleware de logging, 
*     pero que puede ser cualquier cosa que quiera ejecutar 
*     desde el router antes del controler
*
*  En un middleware como este podriamos contar tambien llamadas, seguridad, etc
*/
export function logRequest(req, res, next){
    if (config.LOGREQUEST === "1"){
        const expressReq = {
            time: new Date(),
            hostName: req.hostname,
            method: req.method,
            url: req.url,
            params: req.params,
            query: req.query,
            userAgent: req.headers["user-agent"],
            contentType: req.headers["content-type"],
            autorizacion: req.headers["authorization"],
            body: req.body
        };
        console.log("Log: ", expressReq);
    }
    next();
}