import { pool, dbErrorMsg } from "../database/db.js";
import Caso from "../models/casos_model.js"

const selectJoin = "SELECT c.id as casoId, c.clienteId, c.fechaAlta, c.fechaInicio, c.fechaFin, c.statusDatosID, c.estadoID as cabEstadoID, c.retiro, " +
                   "c.opcionRetiroId, c.idCRM, c.dirCalle, c.dirNumero, c.dirProvinciaId, p.nombre as dirProvincia, c.dirLocalidad, c.dirCodigoPostal, c.fotoDestruccionLink, c.tipoCaso, " +
                   " i.id as itemId, i.fila, i.tipoProductoId, i.productoId, i.color, i.serie, i.nroFactura, i.fechaFactura, " + 
                   "i.estadoID as itemEstadoID, i.fallaCliente, i.fallaStdId, i.causa" +
                   " FROM Casos_Cabecera c INNER JOIN Casos_Items i ON c.id = i.casoId" +
                   " INNER JOIN Provincias p ON c.dirProvinciaId = p.id ";



export default class CasoService{
    
    static async getAll() {
        const [rowsJoin] = await pool.query(selectJoin);
        return Caso.getArray(rowsJoin);
    }
                 

    static async getById(id) {
        const [rows] = await pool.query(`${selectJoin} WHERE c.id = ?`, [id]);
        if (rows.length === 0) dbErrorMsg(404, "El caso no existe");
        return Caso.newFromSelect(rows);
    }


    static async create(caso) {
        let conn = null;
        try{
            conn = await pool.getConnection();
            await conn.beginTransaction();

            const casoToAdd = Caso.cabeceraToAdd(caso);
            const [rows] = await conn.query("INSERT INTO Casos_Cabecera SET ?", [casoToAdd]); 
            casoToAdd.id = rows.insertId;

            const itemsToAdd = Caso.itemsToAdd(caso);
            for (let i=0; i < itemsToAdd.length; i++){
                itemsToAdd[i].casoId = casoToAdd.id;
                const [rows] = await conn.query("INSERT INTO Casos_Items SET ?", [itemsToAdd[i]]);
            }

            await conn.commit();
            return CasoService.getById(casoToAdd.id);
        }catch(error){
            await conn.rollback();
            throw error;
        }finally{
            conn.release();
        }             
    }

/*
    static async delete(id) {
        const [rows] = await pool.query("DELETE FROM Casos WHERE id = ?", [id]);
        if (rows.affectedRows != 1) dbErrorMsg(404, "El caso no existe");
        return true;
    }

    static async update(id, partsOfProduct){
        const [rows] = await pool.query("UPDATE Casos SET ? WHERE id = ?", [partsOfProduct, id]);
        if (rows.affectedRows != 1) dbErrorMsg(404, "El caso no existe");
        return CasoService.get(id, "id");
    }
*/
}