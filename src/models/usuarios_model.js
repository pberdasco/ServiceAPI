import Cripto from "../middleware/bcrypt_handle.js";
import "./usuarios_model_type.js"; 

export default class Usuarios{
    /** @type {int} pk autoIncrement*/
    id;   
    /** @type {string} (30c) Nombre del Usuario */              
    nombre;             
    /** @type {string} (Unique 60c) Mail del Usuario */
    mail;              
    /** @type {string} (FK 10c) Para usuarios de clientes Retail id en la tabla de clientesERP*/
    idClienteERP;       //string(10)
    /** 
     * (FK 4c) tipo de derechos "1000", "0100", "0010". El nombre de los derechos se encuentra en la tabla de roles
     * @type {string} */
    derechos;
    /** @type {string} (64c) clave encritada con bcrypt */           
    password;           
    /** @type {string} (30c) solo lectura: nombre de la empresa donde trabaja el usuario (del join con idClienteERP)*/
    empresa;
    /** @type {string} (20c) solo lectura: nombre del rol que define a derechos (del join con roles) */         
    rol;
    /** @type {string} (30c) calle, numero, piso y depto default de recepcion / entrega */
    dirCalle;
    /** @type {number} (int) id de la provincia default de recepcion/entrega. Permite hacer join con la tabla de Provincias  */
    dirProvincia;
    /** @type {string} (45c) localidad de recepcion/entrega */
    dirLocalidad;
    /** @type {string} (7c) codigo postal default de recepcion/entrega */
    dirCodigoPostal;
    /** @type {number} (int) codigo de rango horario default de recepcion/entrega */
    horario;

    /**
     * Crea un objeto Usuarios a partir de los datos de un select con todos los campos de usuario mas sus joins directos
     * @param {t_User} userToAdd - Datos como extrae un select con los joins directos
     */
    constructor(userToAdd){
        this.id = userToAdd.id;
        this.nombre = userToAdd.nombre;
        this.mail = userToAdd.mail;
        this.idClienteERP = userToAdd.idClienteERP || "";
        this.derechos = userToAdd.derechos || "0000";
        this.password = userToAdd.password;
        this.empresa = userToAdd.empresa;
        this.dirCalle = userToAdd.dirCalle || "";
        this.dirProvincia = userToAdd.dirProvincia || 0;
        this.dirLocalidad = userToAdd.dirLocalidad || "";
        this.dirCodigoPostal = userToAdd.dirCodigoPostal || "";
        this.horario = userToAdd.horario || 0; 
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