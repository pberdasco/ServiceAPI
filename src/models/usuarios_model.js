import Cripto from "../middleware/bcrypt_handle.js";

export default class Usuarios{
    id;                 //int         -- pk autoIncrement
    nombre;             //string(30)
    mail;               //string(60)  -- unique
    idClienteERP;       //string(10)
    derechos;           //string(20)  ="100000000"  pos1=1=todo, pos2=1=cargaCasos, pos3=1...
    password;           //string(64)
    empresa;            //string(30)  -- no se graba es del join con ClientesERP

    constructor(userToAdd){
        this.id = userToAdd.id;
        this.nombre = userToAdd.nombre;
        this.mail = userToAdd.mail;
        this.idClienteERP = userToAdd.idClienteERP || "";
        this.derechos = userToAdd.derechos || "0000";
        this.password = userToAdd.password;
        this.empresa = userToAdd.empresa;
    }

    toJson() {
        return {
            id: this.id,
            nombre: this.nombre,
            mail: this.mail,
            idClienteERP: this.idClienteERP,
            derechos: this.derechos,
            empresa: this.empresa,
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
            idClienteERP: user.idClienteERP || "",
            derechos: user.derechos || "0000",
            password: encriptedPassword,
        };
    }

    static async toUpdate(user){
        // en update no se cambia la clave ni la password  (para la password crear un chgpass)
        return{
            nombre: user.nombre,
            idClienteERP: user.idClienteERP || "",
            derechos: user.derechos || "0000",
        };
    }

    static async validaPassword(pass, record){
        const isOk = await Cripto.verified(pass, record.password);
        return isOk;
    }
}