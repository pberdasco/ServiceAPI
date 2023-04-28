import { pool, dbErrorMsg } from "../database/db.js";


export default class EstadoCabService{
    
    static async getAll() {
        const [rows] = await pool.query("SELECT ec.id, ec.nombre, ec.colorClaseId, cc.claseCSS " + 
                                        "FROM Estado_Cabecera ec INNER JOIN Color_Clase cc ON ec.colorClaseId = cc.id");
        return rows;
    }
}