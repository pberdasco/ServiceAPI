import { pool } from "../database/db.js";

const selectBase = "SELECT * FROM Provincias";

export default class ProvinciaService{
    
    static async getAll() {
        const [rows] = await pool.query(selectBase);
        return rows;
    }
}