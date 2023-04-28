import { pool, dbErrorMsg } from "../database/db.js";


export default class EstadoItemService{
    
    static async getAll() {
        const [rows] = await pool.query("SELECT ei.id, ei.nombre, ei.colorClaseId, cc.claseCSS " + 
                                        "FROM Estado_Items ei INNER JOIN Color_Clase cc ON ei.colorClaseId = cc.id");
        return rows;
    }
}