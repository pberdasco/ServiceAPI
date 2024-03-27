import { pool, dbErrorMsg } from "../database/db.js";
import Cliente from "../models/clientes_model.js";

const selectBase = "SELECT * FROM Clientes ";

export default class ClientesService{
    
    static async getAll() {
        const [rows] = await pool.query(selectBase);
        return rows;
    }
                 

    static async getById(id) {
        const [rows] = await pool.query(selectBase + "WHERE id = ?", [id]);
        if (rows.length === 0) dbErrorMsg(404, "El cliente no existe");
        return new Cliente(rows[0]);
    }

    static async getByEmail(email) {
        const [rows] = await pool.query(selectBase + "WHERE mail = ?", [email]);
        if (rows.length === 0) dbErrorMsg(404, "El cliente no existe");
        return new Cliente(rows[0]);
    }

    static async create(cliente) {
        const clienteToAdd = Cliente.toAdd(cliente);
        try{
            const [rows] = await pool.query("INSERT INTO Clientes SET ?", [clienteToAdd]); 
            clienteToAdd.id = rows.insertId;
            return new Cliente(clienteToAdd);
        }catch(error){
            if (error?.code === "ER_DUP_ENTRY") dbErrorMsg(409, "El cliente ya existe");
            dbErrorMsg(500, error?.sqlMessage);
        }                          
    }

    static async delete(id) {
        const [rows] = await pool.query("DELETE FROM Clientes WHERE id = ?", [id]);
        if (rows.affectedRows != 1) dbErrorMsg(404, "El cliente no existe");
        return true;
    }

    static async update(id, partsOfCliente){
        const [rows] = await pool.query("UPDATE Clientes SET ? WHERE id = ?", [partsOfCliente, id]);
        if (rows.affectedRows != 1) dbErrorMsg(404, "El cliente no existe");
        return ClientesService.getById(id);
    }

}