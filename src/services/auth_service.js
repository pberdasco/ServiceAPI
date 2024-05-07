import { pool, dbErrorMsg } from "../database/db.js";
import Usuarios from "../models/usuarios_model.js";
import JWT from "../middleware/jwt_handle.js";

const select = "SELECT u.id, u.nombre, u.mail, u.idClienteERP, u.derechos, c.empresa " + 
               "FROM Usuarios u " + 
               "LEFT JOIN ClientesERP c ON u.idClienteERP = c.idClienteERP " + 
               "LEFT JOIN DireccionDefault_Retail d ON u.id = d.idUsuario " + 
               "LEFT JOIN Roles r N u.derechos = r.derechos";

export default class AuthService{
    static async userLogin(mail, pass){
        try{
            const [rows] = await pool.query("SELECT * FROM Usuarios u LEFT JOIN ClientesERP c ON u.idClienteERP = c.idClienteERP WHERE mail = ?", [mail]);
            if (rows.length === 0) dbErrorMsg(401, "Credenciales Invalidas");

            const isOk = await Usuarios.validaPassword(pass, rows[0]);
            if (!isOk) dbErrorMsg(401, "Credenciales Invalidas");

            const user = new Usuarios(rows[0]);
            return {token: JWT.generateToken(rows[0].mail), user: user.toJson()};  // aca podria mandar un payload mayor.
        }catch(error){
            // if (error.status === 401) throw error;
            // dbErrorMsg(500, error?.sqlMessage);
            dbErrorMsg(error.status || 500, error?.sqlMessage || error.message);
        }
    }

    static async userRegister(user){
        const userToAdd = await Usuarios.toAdd(user);
        try{
            const [rows] = await pool.query("INSERT INTO Usuarios SET ?", [userToAdd]); 
            userToAdd.id = rows.insertId;
            return new Usuarios(userToAdd);
        }catch (error){
            //mail es clave unica (ademas del id)
            if (error?.code === "ER_DUP_ENTRY") dbErrorMsg(409, "El usuario ya existe");
            dbErrorMsg(500, error?.sqlMessage);
        } 
    }

    static async userUpdate(updatedUser) {
        if (!updatedUser.mail) dbErrorMsg(400, "Debe estar el mail en el requerimiento de usuario" );
        try {
            const userToUpdate = await Usuarios.toUpdate(updatedUser);
            const [result] = await pool.query("UPDATE Usuarios SET ? WHERE mail = ?", [userToUpdate, updatedUser.mail]);
            
            if (result.affectedRows !== 1) {
                dbErrorMsg(404, "El usuario no existe");
            }
            const [rows] = await pool.query(select + " WHERE mail = ?", [updatedUser.mail]);          
            return new Usuarios(rows[0]);
        } catch (error) {
            dbErrorMsg(error.status || 500, error?.sqlMessage || error.message);
        }
    }
    

    static async getAll() {
        try{
            const [rows] = await pool.query(select);
            return rows;
        }catch(error){
            dbErrorMsg(500, error?.sqlMessage);
        }       
    }

    static async delete(id) {
        //Quizas hay que implementar marca de deshabilitado en lugar de borrar
        const [rows] = await pool.query("DELETE FROM Usuarios WHERE id = ?", [id]);
        if (rows.affectedRows != 1) dbErrorMsg(404, "El Usuario no existe");
        return true;
    }
}