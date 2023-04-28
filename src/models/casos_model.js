import Direccion from "./direccion_model.js";
import CasoItem from "./casos_items_model.js";

export default class Caso{
    id;                     // int
    // codigo;                 // string(8)  => eliminado ver si en algun momento se pone en el objeto pero no en la base
    cliente;                // {id, nombre, apellido, mail, empresa, tipoDoc, documento. idERP, idCRM}
    fechaAlta;              // date
    fechaInicio;            // date
    fechaFin                // date
    statusDatosID           // int
    estadoID                // int
    retiro                  // int
    opcionRetiroId          // int
    idCRM                   // string(10)
    direccion = new Direccion();
    fotoDestruccionLink     // string(45)
    tipoCaso                // string(1)
    items = []              // CasoItems collection

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
        this.fechaAlta = cabecera.fechaAlta;
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
        this.direccion.codigoPostal = cabecera.dirCodigoPostal
        this.fotoDestruccionLink = cabecera.fotoDestruccionLink;
        this.tipoCaso = cabecera.tipoCaso;     
        items.forEach((i) => {
            this.items.push(new CasoItem(i));            
        }); 
    }

    toJson() {
        return {   
            id: this.id,
            cliente: this.cliente,
            fechaAlta: this.fechaAlta,
            fechaInicio: this.fechaInicio,
            fechaFin: this.fechaFin,
            statusDatosID: this.statusDatosID,
            estadoID: this.estadoID,
            retiro: this.retiro,
            opcionRetiroId: this.opcionRetiroId,
            idCRM: this.idCRM,
            direccion: this.direccion,
            fotoDestruccionLink: this.fotoDestruccionLink,
            tipoCaso: this.tipoCaso,
            items: this.items.map((i) => i.toJson()),
        }
    };
    
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
                fechaAlta: row.fechaAlta?.toISOString().slice(0, 10) || null,
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
                fotoDestruccionLink: row.fotoDestruccionLink,
                tipoCaso: row.tipoCaso,
            }
        }

        function extraeItem(row){
            return {
                id: row.itemId,
                casoId: row.casoId,             
                fila: row.fila,               
                tipoProductoId: row.tipoProductoId,     
                productoId: row.productoId,         
                color: row.color,         
                serie: row.serie,              
                nroFactura: row.nroFactura,         
                fechaFactura: row.fechaFactura?.toISOString().slice(0, 10) || null,     
                estadoID: row.itemEstadoID,        
                fallaCliente : row.fallaCliente,       
                fallaStdId : row.fallaStdId,       
                causa: row.causa,
            }
        }
    }

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
        })
        casos.push(Caso.newFromSelect(caso));
        return casos;
    }

    //asegura que cualquier otro campo (sobretodo id y tipoProducto) que venga en la api no se tenga en cuenta
    // deben ser los datos de la base de datos menos el id
    static cabeceraToAdd(caso){
        return {
            clienteId: caso.cliente.id,  
            fechaAlta: caso.fechaAlta.substr(0, 10) || null,
            fechaInicio: caso.fechaInicio.substr(0, 10) || null,  
            fechaFin: caso.fechaFin.substr(0, 10) || null,         
            statusDatosID: caso.statusDatosID,
            estadoID: caso.estadoID,
            retiro: caso.retiro,
            opcionRetiroId: caso.opcionRetiroId,
            idCRM: caso.idCRM,
            dirCalle: caso.dirCalle,
            dirNumero: caso.dirNumero,
            dirProvinciaId: caso.dirProvinciaId,
            dirLocalidad: caso.dirLocalidad,
            dirCodigoPostal: caso.dirCodigoPostal,
            fotoDestruccionLink: caso.fotoDestruccionLink,
            tipoCaso:caso.tipoCaso,     
        }
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
                    causa: x.causa})   
                                
        });
        return items;
    }
}