import config from "../config.js";

/** 
*  Ejemplo de un middleware de logging, 
*     pero que puede ser cualquier cosa que quiera ejecutar 
*     desde el router antes del controler
*
*  En un middleware como este podriamos contar tambien llamadas, seguridad, etc
* Esta devolviend una funcion para que pueda recibir parametros.
* @example
* Se puede llamar: 
*               casoRouter.get("/detallado", logRequest({ logLevel: "2" }), CasoController.getAll); //  toma nivel 2
*               casoRouter.get("/detallado", logRequest(), CasoController.getAll); //toma default de variable de entorno
* @param {{logLevel: int}} [options={}] 
*/
export function logRequest(options = {}) {
    const defaultLogLevel = config.LOGREQUEST || "none"; // Valor predeterminado desde la configuración global
    const { logLevel = defaultLogLevel } = options; // Desestructura y usa el valor proporcionado o el predeterminado

    return function(req, res, next) {
        // Verificar si el nivel de registro es adecuado
        // 1: corto, 2: corto con body, 3: largo con body. Otro valor no imprime. Body si es < 1000 carateres
        if (logLevel === "1" || logLevel === "2" || logLevel === "3") {
            const expressReq = {
                time: new Date(),
                methodAndUrl: `${req.method}-http://${req.hostname}:${req.socket.localPort}${req.originalUrl}`,
                params: req.params,
                querys: req.query,
            };

            if (logLevel === "3") {
                expressReq.userAgent = req.headers["user-agent"];
                expressReq.contentType = req.headers["content-type"];
                expressReq.autorizacion = req.headers["authorization"];
            }

            // Controlar si el body debe ser logueado o no
            if ((logLevel === "2" || logLevel === "3") && req.body) {
                expressReq.body = req.body;
            }
            
            console.log("Log: ", expressReq);
        }

        next();
    };
}