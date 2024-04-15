import config from "../config.js";
import {createPool} from "mysql2/promise";

export const pool = createPool({
    host: config.DB.HOST,
    user: config.DB.USER,
    password: config.DB.PASSWORD,  // Nota: tuve que generar un nuevo usuario administrador qeu usa seguridad
    //                                      estandar y no SHA?? porque el cliente no lo soporta
    database: config.DB.DATABASE,
    port: config.DB.PORT
});

export function dbErrorMsg(code, message){
    const error = new Error(message);
    error.status = code;
    throw error;
}
