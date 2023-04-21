export default class Productos{
    id;                // int
    tipoProductoId;    // int
    tipoProducto;      // nombre del tipo de producto  Nota: no esta en la base
    idERP;             // string (20)
    nombre;            // string (45)
    serviceable        // int 0=false 1=true

    constructor(row){
        this.id = row.id;
        this.tipoProductoId = row.tipoProductoId;
        this.tipoProducto = row.tipoProducto;
        this.idERP = row.idERP;
        this.nombre = row.nombre;
        this.serviceable = row.serviceable;
    }

    toJson() {
        return {
            id: this.id,               
            tipoProductoId: this.tipoProductoId,
            tipoProducto: this.tipoProducto,
            idERP: this.idERP,
            nombre: this.nombre,
            serviceable: this.serviceable
        };
    }

    // asegura que cualquier otro campo (sobretodo id y tipoProducto) que venga en la api no se tenga en cuenta
    static toAdd(producto){
        return {
            tipoProductoId: producto.tipoProductoId,
            idERP: producto.idERP,
            nombre: producto.nombre,
            serviceable: producto.serviceable
        }
    }
}