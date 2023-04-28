import { pool, dbErrorMsg } from "../database/db.js";


export default class EstadoItemService{
    
    static async getAll() {
        const [rows] = await pool.query("SELECT sd.id, sd.nombre, sd.colorClaseId, cc.claseCSS " + 
                                        "FROM Status_Datos sd INNER JOIN Color_Clase cc ON sd.colorClaseId = cc.id");
        return rows;
    }
}