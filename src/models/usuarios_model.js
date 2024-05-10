//@ts-check
import Cripto from "../middleware/bcrypt_handle.js";
import "./usuarios_model_type.js"; 

export default class Usuarios{
    /** @type {number} (int) pk autoIncrement*/
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
    /** @type {string | number} (64c) clave encritada con bcrypt */           
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
     * @param {t_User} userToAdd - Datos del usuario como los extrae un select con los joins directos
     */
    constructor(userToAdd){
        this.id = userToAdd.id;
        this.nombre = userToAdd.nombre;
        this.mail = userToAdd.mail;
        this.idClienteERP = userToAdd.idClienteERP || "";
        this.derechos = userToAdd.derechos || "0000";
        this.rol = userToAdd.rol || "";
        this.password = userToAdd.password;
        this.empresa = userToAdd.empresa;
        this.dirCalle = userToAdd.dirCalle || "";
        this.dirProvincia = userToAdd.dirProvincia || 0;
        this.dirLocalidad = userToAdd.dirLocalidad || "";
        this.dirCodigoPostal = userToAdd.dirCodigoPostal || "";
        this.horario = userToAdd.horario || 0; 
        this.rangoHorario = userToAdd.rangoHorario || "";
        this.provincia = userToAdd.provincia || ""; 
    }

    /**
     * Crea una lista de objetos Usuario
     * @param {Array<t_User>} rows - Array con los datos de los usuarios obtenidos de un select
     * @returns {Array<t_UserResponse>} 
     */
    static list(rows){
        const result = rows.map(x => new Usuarios(x).toResponse());
        return result;
    }

    /**
     * Genera el objeto literal de devolvera el endpoint
     * @returns {t_UserResponse} Objeto literal con todas las propiedades del objeto de instancia menos la password
     */
    toResponse() {
        const response = JSON.parse(JSON.stringify(this));
        delete response.password;
        return response;
    } 

    /**
     * Transforma el body del request en la estructura requerida para crear el usuario en la BD
     * @param {t_UserBody | t_User} user body del request. Debería ser al menos t_UserBody, pero puede ser t_User porque lo incluye
     * @returns {Promise<t_UserTables>}
     */
    static async toAdd(user){
        //TODO: eliminar aqui el encriptado. La clave tiene que venir encriptada desde el cliente.
        if (typeof user.password === "number"){
            user.password = user.password.toString();
        }
        const encriptedPassword = await Cripto.encrypt(user.password);
        return{
            user:{
                id: 0,
                nombre: user.nombre,
                mail: user.mail,
                idClienteERP: user.idClienteERP || "",
                derechos: user.derechos || "0000",
                password: encriptedPassword,
            },
            retail:{
                idUsuario: 0, //se debe actualizar con el id de user despues de grabar Usuarios
                dirCalle: user.dirCalle || "", 
                dirProvincia: user.dirProvincia || 0, 
                dirLocalidad: user.dirLocalidad || "", 
                dirCodigoPostal: user.dirCodigoPostal || "", 
                horario: user.horario || 0
            }
        };
    }

    /**
     * Transforma el body del request en una estructura valida para hacer update en alguna o en ambas tablas de usuarios
     * La estructura pueden ser todo los datos o ser parcial. Es obligatorio mail y algun dato mas
     * @param {*} user 
     * @returns {Promise<t_UserUpdate>}
     */
    static async toUpdate(user){
        //TODO: para la password crear un chgpass)
        
        /** @type {t_UserUpdate} updateData */
        const updateData = {
            mailKey: user.mail,
            user:{},
            retail:{}
        };
        if (user.nombre !== undefined && user.nombre !== null) updateData.user.nombre = user.nombre;
        if (user.idClienteERP !== undefined && user.idClienteERP !== null) updateData.user.idClienteERP = user.idClienteERP;
        if (user.derechos !== undefined && user.derechos !== null) updateData.user.derechos = user.derechos;
        if (user.dirCalle !== undefined && user.dirCalle !== null) updateData.retail.dirCalle = user.dirCalle;
        if (user.dirProvincia) updateData.retail.dirProvincia = user.dirProvincia;
        if (user.dirLocalidad !== undefined && user.dirLocalidad !== null) updateData.retail.dirLocalidad = user.dirLocalidad;
        if (user.dirCodigoPostal !== undefined && user.dirCodigoPostal !== null) updateData.retail.dirCodigoPostal = user.dirCodigoPostal;
        if (user.horario) updateData.retail.horario = user.horario;

        return updateData;
    }

    /**
     * Valida si la password recibida es valida para el usuario del registro 
     * @param {string} pass - password encriptada deberia haber llegado en el body
     * @param {object} record - registro del usuario
     * @returns {Promise<boolean>}
     */
    static async validaPassword(pass, record){
        const isOk = await Cripto.verified(pass, record.password);
        return isOk;
    }
}