import { pool, dbErrorMsg } from "../database/db.js";
import Producto from "../models/productos_model.js"

const selectBase = "SELECT p.*, t.nombre AS tipoNombre FROM Productos p JOIN Tipos_de_Producto t ON p.tipoProductoId = t.id ";

export default class ProductoService{
    
    static async getAll() {
        const [rows] = await pool.query(selectBase);
        return rows;
    }
                 
    static async getAllByTipoId(id) {
        const [rows] = await pool.query(selectBase + "WHERE tipoProductoId = ?", [id]);
        return rows;
    }

    static async get(id, by) {
        const byField = (by === 'idERP') ? 'idERP' : 'id';
        const [rows] = await pool.query(selectBase + `WHERE p.${byField} = ?`, [id]);
        if (rows.length === 0) dbErrorMsg(404, "El producto no existe");
        return new Producto(rows[0]);
    }

    static async create(producto) {
            const productoToAdd = Producto.toAdd(producto);
            try{
                const [rows] = await pool.query("INSERT INTO Productos SET ?", [productoToAdd]); 
                productoToAdd.id = rows.insertId;
                return new Producto(productoToAdd);
            }catch(error){
                if (error?.code === "ER_DUP_ENTRY") dbErrorMsg(409, "El producto ya existe");
                dbErrorMsg(500, error?.sqlMessage);
            }                          
    }

    static async delete(id) {
        const [rows] = await pool.query("DELETE FROM Productos WHERE id = ?", [id]);
        if (rows.affectedRows != 1) dbErrorMsg(404, "El producto no existe");
        return true;
    }

    static async update(id, partsOfProduct){
        const [rows] = await pool.query("UPDATE Productos SET ? WHERE id = ?", [partsOfProduct, id]);
        if (rows.affectedRows != 1) dbErrorMsg(404, "El producto no existe");
        return ProductoService.get(id, "id");
    }

}