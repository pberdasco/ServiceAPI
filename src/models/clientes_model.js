export default class Clientes{
    id;                // int
    codigo;             // string (77)
    nombre;             // string (30)
    apellidoo;          // string (30)
    mail;               // string (60)
    empresa;            // string (45)
    tipoDoc;            // string (1)
    documento;          // string (13)
    entregaDefault;     // int  -def: 1
    tipo;               // string (1)  -def 'C'
    dirCalle;           // string (30)
    dirNumero;          // string (6)
    dirProvincia;       // int   -<FK>
    dirLocalidad;       // string (30)
    dirCodigoPostal;    // string (7)
    idERP;              // string (10)
    idCRM;              // string 10
    telefono;           // string (15)        


    constructor(row){ 
        this.id = row.id;
        this.codigo = row.codigo;
        this.nombre = row.nombre;
        this.apellido = row.apellido;
        this.mail = row.mail;  
        this.empresa = row.empresa;
        this.tipoDoc = row.tipoDoc;
        this.documento = row.documento;
        this.entregaDefault = row.entregaDefault;
        this.tipo = row.tipo;
        this.dirCalle = row.dirCalle;
        this.dirNumero = row.dirNumero;
        this.dirProvincia = row.dirProvincia;
        this.dirLocalidad = row.dirLocalidad;
        this.dirCodigoPostal = row.dirCodigoPostal;
        this.idERP = row.idERP;
        this.idCRM = row.idCRM;  
        this.telefono = row.telefono;
    }

    toJson() {
        return {
            id : this.id,
            codigo : this.codigo,
            nombre : this.nombre,
            apellido : this.apellido,
            mail : this.mail,  
            empresa : this.empresa,
            tipoDoc : this.tipoDoc,
            documento : this.documento,
            entregaDefault : this.entregaDefault,
            tipo : this.tipo,
            dirCalle : this.dirCalle,
            dirNumero : this.dirNumero,
            dirProvincia : this.dirProvincia,
            dirLocalidad : this.dirLocalidad,
            dirCodigoPostal : this.dirCodigoPostal,
            idERP : this.idERP,
            idCRM : this.idCRM,
            telefono : this.telefono,
        };
    }

    // asegura que cualquier otro campo (sobretodo id y tipoProducto) que venga en la api no se tenga en cuenta
    static toAdd(cliente){
        return {
            codigo : cliente.codigo,
            nombre : cliente.nombre,
            apellido : cliente.apellido,
            mail : cliente.mail,  
            empresa : cliente.empresa,
            tipoDoc : cliente.tipoDoc,
            documento : cliente.documento,
            entregaDefault : cliente.entregaDefault,
            tipo : cliente.tipo,
            dirCalle : cliente.dirCalle,
            dirNumero : cliente.dirNumero,
            dirProvincia : cliente.dirProvincia,
            dirLocalidad : cliente.dirLocalidad,
            dirCodigoPostal : cliente.dirCodigoPostal,
            idERP : cliente.idERP,
            idCRM : cliente.idCRM,
            telefono : cliente.telefono,
        };
    }
}