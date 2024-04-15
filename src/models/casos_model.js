import Direccion from "./direccion_model.js";
import CasoItem from "./casos_items_model.js";
import crypto from "crypto";

function generarToken() {
    return crypto.randomBytes(10).toString("hex");
}

export default class Caso{
    id;                     // int
    // codigo;                 // string(8)  => eliminado ver si en algun momento se pone en el objeto pero no en la base
    cliente;                // {id, nombre, apellido, mail, empresa, tipoDoc, documento. idERP, idCRM, telefono}
    fechaAlta;              // date
    fechaCarga;             // date
    fechaInicio;            // date
    fechaFin;                // date
    statusDatosID;           // int
    estadoID;                // int
    retiro;                  // int
    opcionRetiroId;          // int
    idCRM;                   // string(10)
    telefono;                // string (20)
    direccion = new Direccion();
    tipoCaso;                // string(1)
    mensaje;                 // string(200) para enviarle mensajes al cliente                
    items = [];              // CasoItems collection

    constructor(cabecera, items){
        this.id = cabecera.id;
        this.cliente = {};
        this.cliente.id = cabecera.clienteId;  
        this.cliente.nombre = cabecera.cliNombre;
        this.cliente.apellido = cabecera.cliApellido;
        this.cliente.mail = cabecera.cliMail;
        this.cliente.empresa = cabecera.cliEmpresa;
        this.cliente.tipoDoc = cabecera.cliTipoDoc;
        this.cliente.documento = cabecera.cliDocumento;
        this.cliente.idERP = cabecera.cliIdERP;
        this.cliente.telefono = cabecera.cliTelefono;
        this.fechaAlta = cabecera.fechaAlta;
        this.fechaCarga = cabecera.fechaCarga;
        this.fechaInicio = cabecera.fechaInicio;  
        this.fechaFin = cabecera.fechaFin;         
        this.statusDatosID = cabecera.statusDatosID;
        this.estadoID = cabecera.estadoID;
        this.retiro = cabecera.retiro;
        this.opcionRetiroId = cabecera.opcionRetiroId;
        this.idCRM = cabecera.idCRM;
        this.direccion.calle = cabecera.dirCalle;
        this.direccion.numero = cabecera.dirNumero;
        this.direccion.provinciaId = cabecera.dirProvinciaId;
        this.direccion.provincia = cabecera.dirProvincia;
        this.direccion.localidad = cabecera.dirLocalidad;
        this.direccion.codigoPostal = cabecera.dirCodigoPostal;
        this.tipoCaso = cabecera.tipoCaso;  
        this.tokenLink= cabecera.tokenLink;   
        this.mensaje = cabecera.mensaje;
        items.forEach((i) => {
            this.items.push(new CasoItem(i));            
        }); 
    }

    //convierte al formato que devuelve la api
    toJson() {
        return {   
            id: this.id,
            cliente: this.cliente,                     //objeto cliente
            fechaAlta: this.fechaAlta,
            fechaCarga: this.fechaCarga,
            fechaInicio: this.fechaInicio,
            fechaFin: this.fechaFin,
            statusDatosID: this.statusDatosID,
            estadoID: this.estadoID,
            retiro: this.retiro,
            opcionRetiroId: this.opcionRetiroId,
            idCRM: this.idCRM,
            direccion: this.direccion,                 //objeto direccion
            tipoCaso: this.tipoCaso,
            tokenLink: this.tokenLink,
            mensaje: this.mensaje,
            items: this.items.map((i) => i.toJson()),
        };
    }
    
    // Genera un objeto caso, con sus items a partir de rowsCaso que son las filas del select
    static newFromSelect(rowsCaso){
        const items = [];
        rowsCaso.forEach((x) => items.push(extraeItem(x)));
        return new Caso(extraeCaso(rowsCaso[0]), items);

        // extraeCaso y extraeItem toma los datos que devuelve la consulta en una fila
        // y los separa y prepara para que cumplan con la estructura que requieren 
        // los constructores de la clase Caso e Item
        function extraeCaso(row){
            return {
                id: row.casoId,
                clienteId: row.clienteId,
                cliNombre: row.nombre,
                cliApellido: row.apellido,
                cliMail: row.mail,
                cliEmpresa: row.empresa,
                cliTipoDoc: row.tipoDoc,
                cliDocumento: row.documento,
                cliIdERP: row.idERP, 
                cliTelefono: row.telefono, 
                fechaAlta: row.fechaAlta?.toISOString().slice(0, 10) || null,
                fechaCarga: row.fechaCarga?.toISOString().slice(0, 10) || null,
                fechaInicio: row.fechaInicio?.toISOString().slice(0, 10) || null,  
                fechaFin: row.fechaFin?.toISOString().slice(0, 10) || null,         
                statusDatosID: row.statusDatosID,
                estadoID: row.cabEstadoID,
                retiro: row.retiro,
                opcionRetiroId: row.opcionRetiroId,
                idCRM: row.idCRM,
                dirCalle: row.dirCalle,
                dirNumero: row.dirNumero,
                dirProvinciaId: row.dirProvinciaId,
                dirProvincia: row.dirProvincia,
                dirLocalidad: row.dirLocalidad,
                dirCodigoPostal: row.dirCodigoPostal,
                tipoCaso: row.tipoCaso,
                tokenLink: row.tokenLink,
                mensaje: row.mensaje,
            };
        }

        function extraeItem(row){
            return {
                id: row.itemId,
                casoId: row.casoId,             
                fila: row.fila,               
                tipoProductoId: row.tipoProductoId,
                tipoProducto: row.tipoProductoNombre,     
                productoId: row.productoId,         
                producto: row.productoNombre,
                productoIdERP: row.productoIdErp,
                productoServiceable: row.productoServiceable,
                color: row.color,         
                serie: row.serie,              
                nroFactura: row.nroFactura,         
                fechaFactura: row.fechaFactura?.toISOString().slice(0, 10) || null,     
                estadoID: row.itemEstadoID,        
                fallaCliente : row.fallaCliente,       
                fallaStdId : row.fallaStdId,       
                causa: row.causa,
                fotoDestruccionLink: row.fotoDestruccionLink,
                fotoFacturaLink: row.fotoFacturaLink,
            };
        }
    }

    // Genera el array de casos para el GetAll. (Un array de objetos Caso con sus items)
    static getArray(rowsJoin){
        const casos = [];
        let caso = [];
        if (!rowsJoin || !rowsJoin[0]) return [];
        let ultimoCasoId = rowsJoin[0].casoId;
        rowsJoin.forEach((x) =>{
            if (x.casoId === ultimoCasoId){
                caso.push(x);
            }else{
                casos.push(Caso.newFromSelect(caso));
                caso = [];
                caso.push(x);
                ultimoCasoId = x.casoId;
            }
        });
        casos.push(Caso.newFromSelect(caso));
        return casos;
    }

    //asegura que cualquier otro campo (sobretodo id y tipoProducto) que venga en la api no se tenga en cuenta
    // deben ser los datos de la base de datos menos el id
    // también genera el token para ser usado en la url para acceder al caso
    static cabeceraToAddOrUpdate(caso){
        const cabeceraData = {};
        if (caso.clienteId !== undefined) cabeceraData.clienteId = caso.clienteId;
        if (caso.fechaAlta) cabeceraData.fechaAlta = caso.fechaAlta.substr(0, 10);
        if (caso.fechaCarga) cabeceraData.fechaCarga = caso.fechaCarga.substr(0, 10);
        if (caso.fechaInicio) cabeceraData.fechaInicio = caso.fechaInicio.substr(0, 10);
        if (caso.fechaFin) cabeceraData.fechaFin = caso.fechaFin.substr(0, 10);
        if (caso.statusDatosID !== undefined) cabeceraData.statusDatosID = caso.statusDatosID;
        if (caso.estadoID !== undefined) cabeceraData.estadoID = caso.estadoID;
        if (caso.retiro !== undefined) cabeceraData.retiro = caso.retiro;
        if (caso.opcionRetiroId !== undefined) cabeceraData.opcionRetiroId = caso.opcionRetiroId;
        if (caso.idCRM !== undefined) cabeceraData.idCRM = caso.idCRM;
        if (caso.dirCalle !== undefined) cabeceraData.dirCalle = caso.dirCalle;
        if (caso.dirNumero !== undefined) cabeceraData.dirNumero = caso.dirNumero;
        if (caso.dirProvinciaId !== undefined) cabeceraData.dirProvinciaId = caso.dirProvinciaId;
        if (caso.dirLocalidad !== undefined) cabeceraData.dirLocalidad = caso.dirLocalidad;
        if (caso.dirCodigoPostal !== undefined) cabeceraData.dirCodigoPostal = caso.dirCodigoPostal;
        if (caso.tipoCaso !== undefined) cabeceraData.tipoCaso = caso.tipoCaso;
        if (caso.mensaje !== undefined) cabeceraData.mensaje = caso.mensaje;

        // Agrega el token random si esta dando alta. En modificacion no lo toca.
        if (!caso.tokenLink) {
            cabeceraData.tokenLink = generarToken();
        }  
        return cabeceraData;
    }

    static itemsToAdd(caso){
        const items = [];
        caso.items.forEach((x) => {
            items.push({
                casoId: x.casoId,             
                fila: x.fila,               
                tipoProductoId: x.tipoProductoId,     
                productoId: x.productoId,          
                color: x.color,              
                serie: x.serie,              
                nroFactura: x.nroFactura,         
                fechaFactura: x.fechaFactura.substr(0, 10) || null,       
                estadoID: x.estadoID,           
                fallaCliente: x.fallaCliente,       
                fallaStdId: x.fallaStdId,         
                causa: x.causa,
                fotoDestruccionLink: x.fotoDestuccionLink,
                fotoFacturaLink: x.fotoFacturaLink,
            });                            
        });
        return items;
    }
}