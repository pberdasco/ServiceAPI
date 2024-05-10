import Usuarios from "../models/usuarios_model.js";
import "../models/usuarios_model_type.js";
import { pool, dbErrorMsg } from "../database/db.js";
import JWT from "../middleware/jwt_handle.js";

const select = "SELECT u.id, u.nombre, u.mail, u.idClienteERP, u.derechos, u.password, c.empresa, " + 
               "d.idUsuario, d.dirCalle, d.dirProvincia, d.dirLocalidad, d.dirCodigoPostal, d.horario, r.rol, " +
               "c.empresa, r.rol, p.nombre as provincia, h.horario as rangoHorario " + 
               "FROM Usuarios u " + 
               "LEFT JOIN ClientesERP c ON u.idClienteERP = c.idClienteERP " + 
               "LEFT JOIN DireccionDefault_Retail d ON u.id = d.idUsuario " + 
               "LEFT JOIN Roles r ON u.derechos = r.derechos " +
               "LEFT JOIN Rangos_Horarios h ON d.horario = h.id " + 
               "LEFT JOIN Provincias p ON d.dirProvincia = p.id";

export default class AuthService{
    /** 
     * Service para autenticar a un usuario
     * @param {string} mail mail del usuario (unique)
     * @param {string} pass password encriptada (por ahora esta sin encriptar y se encripta en la funcion)
     * @returns {Promise<{token: string, user: object} | undefined> } undefined cuando sale por error
     * @throws {t_Error} Credenciales Invalidas o de DB
     */
    static async userLogin(mail, pass){
        try{
            const [rows] = await pool.query(select + " WHERE mail = ?", [mail]);
            if (!Array.isArray(rows) || rows.length === 0) dbErrorMsg(401, "Credenciales Invalidas");
            const isOk = await Usuarios.validaPassword(pass, rows[0]);
            if (!isOk) dbErrorMsg(401, "Credenciales Invalidas");

            const jwt = JWT.generateToken(rows[0]);
            const user = new Usuarios(rows[0]);

            return {token: jwt, user: user.toResponse()};  // aca podria mandar un payload mayor y solo el token
        }catch(error){
            // if (error.status === 401) throw error;
            // dbErrorMsg(500, error?.sqlMessage);
            dbErrorMsg(error.status || 500, error?.sqlMessage || error.message);
        }
    }

    /**
     * Service para dar de alta un nuevo usuario
     * @param {t_User | t_UserBody} user 
     * @returns {Promise<Usuarios |  undefined>} undefined cuandoo sale por error
     * @throws {t_Error} a traves de dbErrorMsg() levanta errores para que los maneje el controller
     */
    static async userRegister(user){
        const userToAdd = await Usuarios.toAdd(user);
        try{
            const [result] = await pool.query("INSERT INTO Usuarios SET ?", [userToAdd.user]); 
            userToAdd.retail.idUsuario = result.insertId;  // el id devuelto es necesario para grabar en DireccionDefault_Retail
            await pool.query("INSERT INTO DireccionDefault_Retail SET ?", [userToAdd.retail]);
            
            const [rows] = await pool.query(select + " WHERE u.id = ?", [result.insertId]);          
            return new Usuarios(rows[0]);
        }catch (error){
            //mail es clave unica (ademas del id)
            if (error?.code === "ER_DUP_ENTRY") dbErrorMsg(409, "El usuario ya existe");
            dbErrorMsg(500, error?.sqlMessage);
        } 
    }

    /**
     * Service para actualizar Usuarios y/o DireccionDefault_Retail con datos variables 
     * Puede actualizar tanto los datos del usuario como los datos de retail de forma opcional,
     * dependiendo de los campos proporcionados en el objeto `updatedUser`.
     * @param {object} updatedUser 
     * @returns {Promise<Usuarios | undefined>}  undefined cuando sale por error
     * @throws {t_Error} a traves de dbErrorMsg() levanta errores para que los maneje el controller
     */
    static async userUpdate(updatedUser) {
        if (!updatedUser.mail) dbErrorMsg(400, "Debe estar el mail en el requerimiento de usuario" );
        try {
            const userToUpdate = await Usuarios.toUpdate(updatedUser);

            const [rowsForId] = await pool.query("SELECT id FROM Usuarios WHERE mail = ?", [userToUpdate.mailKey]);
            if (!Array.isArray(rowsForId) || rowsForId.length === 0) dbErrorMsg(404, `El usuario ${userToUpdate.mailKey} no existe`);
            const idKey = rowsForId[0].id;

            // tengo campos de Usuarios para actualizar?
            if (Object.keys(userToUpdate.user).length !== 0){
                const [result] = await pool.query("UPDATE Usuarios SET ? WHERE id = ?", [userToUpdate.user, idKey]);
                if (result.affectedRows !== 1) {
                    dbErrorMsg(404, `El usuario ${idKey}-${userToUpdate.mailKey} no existe`);
                }
            }
            // tengo campos de Retail para actualizar?
            if (Object.keys(userToUpdate.retail).length !== 0){
                // si no estaba creado el usario en DireccionDefault_Retail lo creo
                const [existe] = await pool.query("SELECT idUsuario FROM DireccionDefault_Retail WHERE idUsuario = ?", [idKey]);
                if (!Array.isArray(existe) || existe.length === 0){
                    userToUpdate.retail.idUsuario = idKey;  // el id devuelto es necesario para grabar en DireccionDefault_Retail
                    await pool.query("INSERT INTO DireccionDefault_Retail SET ?", [userToUpdate.retail]);
                }else{
                    const [result] = await pool.query("UPDATE DireccionDefault_Retail SET ? WHERE idUsuario = ?", [userToUpdate.retail, idKey]);
                    if (result.affectedRows !== 1) {
                        dbErrorMsg(404, `El usuario ${idKey}-${userToUpdate.mailKey} no existe en DireccionDefault_Retail`);
                    }
                }
            }
            
            const [rows] = await pool.query(select + " WHERE u.id = ?", [idKey]);          
            return new Usuarios(rows[0]);
        } catch (error) {
            dbErrorMsg(error.status || 500, error?.sqlMessage || error.message);
        }
    }
    
    /**
     * Service para recuperar todos los datos del usuario por su id (menos la clave) 
     * @param {number} id (int) id del usuario 
     * @returns {Promise<Usuarios | undefined>} undefined si sale por error
     */
    static async getById(id){
        try{
            const [rows] = await pool.query(select + " WHERE id = ?", [id]);
            if (rows.length === 0) dbErrorMsg(404, `El usuario ${id} no existe`);
            return new Usuarios(rows[0]);
        }catch(error){
            dbErrorMsg(error.status || 500, error?.sqlMessage || error.message);
        }    
    }

    /**
     * Service para recuperar los datos de todos los usuarios (menos las claves) 
     * @returns {Promise<t_UserResponse[] | undefined>} undefined si sale por error
     * @throws {t_Error}
     */
    static async getAll() {
        try{
            const [rows] = await pool.query(select);
            return Usuarios.list(rows);
        }catch(error){
            dbErrorMsg(500, error?.sqlMessage);
        }       
    }

    /**
     * Service para eliminar un usuarioo
     * @param {number} id id del usuario a eliminar
     * @returns true
     * @throws {t_Error}
     */
    static async delete(id) {
        try{
            //Quizas hay que implementar marca de deshabilitado en lugar de borrar
            await pool.query("DELETE FROM DireccionDefault_Retail WHERE idUsuario = ?", [id]);
            const [rows] = await pool.query("DELETE FROM Usuarios WHERE id = ?", [id]);
            if (rows.affectedRows != 1) dbErrorMsg(404, "El Usuario no existe");
            return true;
        }catch (error){
            dbErrorMsg(error.status || 500, error?.sqlMessage || error.message);
        }
    }
}