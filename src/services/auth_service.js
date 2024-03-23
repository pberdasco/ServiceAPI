import { pool, dbErrorMsg } from "../database/db.js";
import Usuarios from "../models/usuarios_model.js";
import JWT from "../middleware/jwt_handle.js";

export default class AuthService{
    static async userRegister(user){
        const userToAdd = await Usuarios.toAdd(user);
        try{
            const [rows] = await pool.query("INSERT INTO Usuarios SET ?", [userToAdd]); 
            userToAdd.id = rows.insertId;
            return new Usuarios(userToAdd);
        }catch (error){
            if (error?.code === "ER_DUP_ENTRY") dbErrorMsg(409, "El usuario ya existe");
            dbErrorMsg(500, error?.sqlMessage);
        } 
    }

    static async userLogin(mail, pass){
        try{
            const [rows] = await pool.query("SELECT * FROM Usuarios WHERE mail = ?", [mail]);
            if (rows.length === 0) dbErrorMsg(401, "Credenciales Invalidas");

            const isOk = await Usuarios.validaPassword(pass, rows[0]);
            if (!isOk) dbErrorMsg(401, "Credenciales Invalidas");

            const user = new Usuarios(rows[0]);
            return {token: JWT.generateToken(rows[0].mail), user: user.toJson()};  // aca podria mandar un payload mayor.
        }catch(error){
            if (error.status === 401) throw error;
            dbErrorMsg(500, error?.sqlMessage);
        }
    }

    static async getAll() {
        try{
            const [rows] = await pool.query("SELECT id, nombre, mail, clienteId FROM Usuarios");
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