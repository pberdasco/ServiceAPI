import { pool, dbErrorMsg } from "../database/db.js";
import Usuarios from "../models/usuarios_model.js"

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

    static async userLogin(){

    }
}