import { pool, dbErrorMsg } from "../database/db.js";
import Caso from "../models/casos_model.js"
import CasoItem from "../models/casos_items_model.js";

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

    
    static async updateCabecera(id, partsOfCasoCabecera){
        const [rows] = await pool.query("UPDATE Casos_Cabecera SET ? WHERE id = ?", [partsOfCasoCabecera, id]);
        if (rows.affectedRows != 1) dbErrorMsg(404, "El caso no existe");
        return CasoService.getById(id);
    }

/*
    static async delete(id) {
        const [rows] = await pool.query("DELETE FROM Casos WHERE id = ?", [id]);
        if (rows.affectedRows != 1) dbErrorMsg(404, "El caso no existe");
        return true;
    }
*/


    // ====================================================================================
    //       Items
    static async getItemById(id) {
        const [rows] = await pool.query("SELECT * FROM Casos_Items WHERE id = ?", [id]);
        if (rows.length === 0) dbErrorMsg(404, "El item no existe");
        //TODO: await CasoService.updateHistoria("Caso", elementoDeUnGet, partsOfItem)
        return new CasoItem(rows[0]);
    }

    static async updateItem(id, partsOfItem){
        const [rows] = await pool.query("UPDATE Casos_Items SET ? WHERE id = ?", [partsOfItem, id]);
        if (rows.affectedRows != 1) dbErrorMsg(404, "El item del caso no existe");

        //TODO: await CasoService.updateHistoria("Item", elementoDeUnGet, partsOfItem)
        return CasoService.getItemById(id);
    }

    static async updateHistoria(tipo, elementoOriginal, partsOfElemento){
        return;
    }


    // -=====================================================================================
    //          Historias
    static async getHistoriaCaso(casoId) {
        const [rows] = await pool.query("SELECT * FROM Historia_Casos_Cabecera WHERE id = ?", [casoId]);
        if (rows.length === 0) dbErrorMsg(404, "No hay historia de cambios para el caso");
        return new Historia("Caso", rows);
    }

    static async getHistoriaItem(itemId) {
        const [rows] = await pool.query("SELECT * FROM Historia_Casos_Items WHERE id = ?", [itemId]);
        if (rows.length === 0) dbErrorMsg(404, "No hay historia de cambios para el item");
        return new Historia("Caso", rows);
    }

}