import { pool, dbErrorMsg } from "../database/db.js";
import Caso from "../models/casos_model.js";
import CasoItem from "../models/casos_items_model.js";

const selectJoin = "SELECT c.id as casoId, c.clienteId, c.fechaAlta, c.fechaCarga, c.fechaInicio, c.fechaFin, c.statusDatosID, c.estadoID as cabEstadoID, " +
                   "c.retiro, c.opcionRetiroId, c.idCRM, c.dirCalle, c.dirNumero, c.dirProvinciaId, p.nombre as dirProvincia, " +
                   "c.dirLocalidad, c.dirCodigoPostal, c.tipoCaso, c.tokenLink, c.mensaje, " +
                   "i.id as itemId, i.fila, i.tipoProductoId, i.productoId, i.color, i.serie, i.nroFactura, i.fechaFactura, " + 
                   "i.estadoID as itemEstadoID, i.fallaCliente, i.fallaStdId, i.causa, i.fotoDestruccionLink, i.fotoFacturaLink, "+
                   "i.aiFacturaWarn, i.aiFotoWarn, i.aiEsFactura, i.aiFechaFactura, i.aiTieneItemValido, i.aiTextoItemValido, i.aiTextoImagen, " +
                   "cl.nombre, cl.apellido, cl.mail, cl.empresa, cl.tipoDoc, cl.documento, cl.idERP, cl.telefono, " +
                   "pr.idERP as productoIdErp, pr.nombre as productoNombre, pr.serviceable as productoServiceable, tp.nombre as tipoProductoNombre" +
                   " FROM Casos_Cabecera c " + 
                   " LEFT JOIN Casos_Items i ON c.id = i.casoId " +
                   " LEFT JOIN Provincias p ON c.dirProvinciaId = p.id " +
                   " LEFT JOIN Clientes cl ON c.clienteId = cl.id " +
                   " LEFT JOIN Productos pr ON i.productoId = pr.id " +
                   " LEFT JOIN Tipos_de_Producto tp ON i.tipoProductoId = tp.id";



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

    static async getByToken(token) {
        const [rows] = await pool.query(`${selectJoin} WHERE c.tokenLink = ?`, [token]);
        if (rows.length === 0) dbErrorMsg(404, "El caso no existe");
        return Caso.newFromSelect(rows);
    }


    static async create(caso) {
        let conn = null;
        try{
            conn = await pool.getConnection();
            await conn.beginTransaction();

            const casoToAdd = Caso.cabeceraToAddOrUpdate(caso);
            const [rows] = await conn.query("INSERT INTO Casos_Cabecera SET ?", [casoToAdd]); 
            casoToAdd.id = rows.insertId;

            const itemsToAdd = Caso.itemsToAdd(caso);
            for (let i=0; i < itemsToAdd.length; i++){
                itemsToAdd[i].casoId = casoToAdd.id;  //asigno la FK de la cabecera a cada item
                await conn.query("INSERT INTO Casos_Items SET ?", [itemsToAdd[i]]); //podria asignar a const [rows] y verificar si llega insertedId
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

    /*  //En principio no vamos a borrar casos...
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

    static async updateAll(id, caso) {
        let conn = null;
        try {
            conn = await pool.getConnection();
            await conn.beginTransaction();
    
            const casoToUpdate = Caso.cabeceraToAddOrUpdate(caso);
            await conn.query("UPDATE Casos_Cabecera SET ? WHERE id = ?", [casoToUpdate, id]);
    
            // Eliminar todos los items existentes del caso
            await conn.query("DELETE FROM Casos_Items WHERE casoId = ?", [id]);
    
            // Insertar los nuevos items del caso
            const itemsToAdd = Caso.itemsToAdd(caso);
            for (let i = 0; i < itemsToAdd.length; i++) {
                itemsToAdd[i].casoId = id;  //por las dudas piso el id del caso en los items con el correcto
                await conn.query("INSERT INTO Casos_Items SET ?", [itemsToAdd[i]]);
            }
    
            await conn.commit();
            return CasoService.getById(id);
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            if (conn) {
                conn.release();
            }
        }
    }
    
    


    // -=====================================================================================
    //          Historias

    // static async createHistoria(tipo, elementoOriginal, partsOfElemento){
    //     const elementoId = (tipo === "Caso") 

    //     for (i = 0; i < partsOfElemento.length; i++){
    //         const historiaToAdd = {
    //             usuarioId: 1,
    //             elementoId: elementoOriginal.id,
    //             fecha: new Date.toISOString(),
    //             campo: partsOfElemento[i].
    //             valorViejo,
    //             valorNuevo};
            
    //         const [rows] = await pool.query("INSERT INTO  Historia_Casos_${tipo} SET ?", [productoToAdd]); 
    //         productoToAdd.id = rows.insertId;
    //     }

    //     const historias = await this.getHistoriaCaso(elementoOriginal.id);
    //     return historias;
    // }                


    // static async getHistoriaCaso(casoId) {
    //     const [rows] = await pool.query("SELECT * FROM Historia_Casos_Cabecera WHERE id = ?", [casoId]);
    //     if (rows.length === 0) dbErrorMsg(404, "No hay historia de cambios para el caso");
    //     return new Historia("Caso", rows);
    // }

    // static async getHistoriaItem(itemId) {
    //     const [rows] = await pool.query("SELECT * FROM Historia_Casos_Items WHERE id = ?", [itemId]);
    //     if (rows.length === 0) dbErrorMsg(404, "No hay historia de cambios para el item");
    //     return new Historia("Item", rows);
    // }

}