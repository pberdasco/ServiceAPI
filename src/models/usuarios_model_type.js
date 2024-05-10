/**
 * @typedef {object} t_Error
 * @property {int} status
 * @property {string} message
 */

/**
 * t_UserRecord representa el registro de la tabla Usuarios sin la password 
 * @typedef {object} t_UserRecord 
 * @property {int} id - pk autoIncrement 
 * @property {string} nombre - (30c) Nombre del Usuario              
 * @property {string} mail - (Unique 60c) Mail del Usuario
 * @property {string} idClienteERP - (FK 10c) Para usuarios de clientes Retail id en la tabla de clientesERP
 * @property {string} derechos - (FK 4c) tipo de derechos "1000", "0100", "0010". El nombre de los derechos se encuentra en la tabla de roles      
 */
 
/**
 * t_UserPassword representa la password del usuario  
 * @typedef {object} t_UserPassword 
 * @property {string | number} password - (64c) clave encritada con bcrypt
 */

/**
 * t_UserRetailDefaults representa el registro puro de la tabla DireccionDefault_Retail 
 * @typedef {object} t_UserRetailDefaults 
 * @property {int} idUsuario - id que vincula el registro con el usuario 
 * @property {string} dirCalle - (30c) calle, numero, piso y depto default de recepcion / entrega
 * @property {number} dirProvincia - (int) id de la provincia default de recepcion/entrega. Permite hacer join con la tabla de Provincias
 * @property {string} dirLocalidad - (45c) localidad de recepcion/entrega
 * @property {string} dirCodigoPostal - (7c) codigo postal default de recepcion/entrega
 * @property {number} horario - (int) codigo de rango horario default de recepcion/entrega 
*/

/**
 * t_UserJoins representa los valores de solo lectura del usuario (obtenidos del join con tablas vinculadas)  
 * @typedef {object} t_UserJoins     
 * @property {string} empresa - (30c) solo lectura: nombre de la empresa donde trabaja el usuario (del join con idClienteERP)
 * @property {string} rol - (20c) solo lectura: nombre del rol que define a derechos (del join con roles)
 * @property {string} rangoHorario (30c) solo lectura: descripcion del rango horario (del join con Rangos_Horarios)
 * @property {string} provincia (32c) solo lectura: en la base es 'nombre' de la provincia (del join cn Provincias)
*/

/**
 * t_User representa el resultado de un select de usuarios completo con password y todos sus joins  
 * @typedef {t_UserRecord & t_UserPassword & t_UserRetailDefaults & t_UserJoins} t_User 
*/

/**
 * t_UserResponse representa el objeto Usuario que se devuelve (incluye todo mens la password)  
 * @typedef {t_UserRecord & t_UserRetailDefaults & t_UserJoins} t_UserResponse 
*/

/**
 * t_UserBody representa la informacion que deberia recibir el body de un alta  
 * @typedef {t_UserRecord & t_UserPassword & t_UserRetailDefaults} t_UserBody 
*/

/**
 * t_UserTables representa la informacion requerida para grabar en las 2 tablas que forman un usuario  
 * @typedef {object} t_UserTables
 * @property {t_UserRecord & t_UserPassword} user
 * @property {t_UserRetailDefaults} retail
*/

/**
 * t_UserUpdate representa la estructura variable de actualizacion
 * @typedef {object} t_UserUpdate
 * @property {string} mailKey - mail es la clave de acceso (unique) para buscar / actualizar usuarios
 * @property {object} user - puede tener ninguno, uno o varias propiedades de t_UserRecord (sin id, ni mail, ni password)
 * @property {object} retail - puede tener ninguno, uno o varias propiedaes de t_UserRetailDefaults (sin id)
 */
