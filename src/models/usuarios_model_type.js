/** @typedef {object} t_User 
  * @property {int} id - pk autoIncrement 
  * @property {string} nombre - (30c) Nombre del Usuario              
  * @property {string} mail - (Unique 60c) Mail del Usuario
  * @property {string} idClienteERP - (FK 10c) Para usuarios de clientes Retail id en la tabla de clientesERP
  * @property {string} derechos - (FK 4c) tipo de derechos "1000", "0100", "0010". El nombre de los derechos se encuentra en la tabla de roles
  * @property {string} password - (64c) clave encritada con bcrypt     
  * @property {string} empresa - (30c) solo lectura: nombre de la empresa donde trabaja el usuario (del join con idClienteERP)
  * @property {string} rol - (20c) solo lectura: nombre del rol que define a derechos (del join con roles)
  * @property {string} dirCalle - (30c) calle, numero, piso y depto default de recepcion / entrega
  * @property {number} dirProvincia - (int) id de la provincia default de recepcion/entrega. Permite hacer join con la tabla de Provincias
  * @property {string} dirLocalidad - (45c) localidad de recepcion/entrega
  * @property {string} dirCodigoPostal - (7c) codigo postal default de recepcion/entrega
  * @property {number} horario - (int) codigo de rango horario default de recepcion/entrega 
*/