import Cripto from "../middleware/bcrypt_handle.js";

export default class Usuarios{
    id;                 //int         -- pk autoIncrement
    nombre;             //string(30)
    mail;               //string(60)  -- unique
    clienteId;          //int
    password;           //string(64)

    constructor(userToAdd){
        this.id = userToAdd.id;
        this.nombre = userToAdd.nombre;
        this.mail = userToAdd.mail;
        this.clienteId = 0;
        this.password = userToAdd.password;
    }

    toJson() {
        return {
            id: this.id,
            nombre: this.nombre,
            mail: this.mail,
            clienteId: this.clienteId,
            //password: this.password
        };
    }

    static async toAdd(user){
        if (typeof user.password === "number"){
            user.password = user.password.toString();
        }
        const encriptedPassword = await Cripto.encrypt(user.password);
        return{
            nombre: user.nombre,
            mail: user.mail,
            clienteId: user.clienteId, 
            password: encriptedPassword,
        };
    }

    static async validaPassword(pass, record){
        const isOk = await Cripto.verified(pass, record.password);
        return isOk;
    }
}