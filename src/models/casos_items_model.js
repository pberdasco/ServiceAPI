export default class CasoItem{
    id;                 //int
    casoId;             //int
    fila;               //int
    producto;           // {tipoId, tipo, id, nombre, idERP, serviceable}
    color;              //string(15)
    serie;              //string(15)
    nroFactura;         //string(20)
    fechaFactura;       //date
    estadoID;           //int
    fallaCliente;       //string(80)
    fallaStdId;         //int
    causa;              //string(80)
    fotoDestruccionLink; // string(45)
    fotoFacturaLink;     // string(45)

    constructor(item){
        this.id = item.id;                 
        this.casoId = item.casoId;             
        this.fila = item.fila;  
        this.producto = {}; 
        this.producto.tipoId = item.tipoProductoId;
        this.producto.tipo = item.tipoProducto;           
        this.producto.id = item.productoId;     
        this.producto.nombre = item.producto;
        this.producto.idERP = item.productoIdERP;
        this.producto.serviceable = item.productoServiceable;   
        this.color = item.color;              
        this.serie = item.serie;              
        this.nroFactura = item.nroFactura;         
        this.fechaFactura = item.fechaFactura;       
        this.estadoID = item.estadoID;           
        this.fallaCliente = item.fallaCliente;       
        this.fallaStdId = item.fallaStdId;         
        this.causa= item.causa;  
        this.fotoDestruccionLink = item.fotoDestruccionLink;
        this.fotoFacturaLink = item.fotoFacturaLink;   
        this.aiFacturaWarn = item.aiFacturaWarn; 
        this.aiFotoWarn = item.aiFotoWarn; 
        this.aiEsFactura = item.aiEsFactura; 
        this.aiFechaFactura = item.aiFechaFactura; 
        this.aiTieneItemValido = item.aiTieneItemValido;
        this.aiTextoItemValido = item.aiTextoItemValido; 
        this.aiTextoImagen = item.aiTextoImagen;
    }

    toJson(){
        return {
            id: this.id,
            casoId: this.casoId,             
            fila: this.fila,               
            producto: this.producto,      // objeto producto         
            color: this.color,         
            serie: this.serie,              
            nroFactura: this.nroFactura,         
            fechaFactura: this.fechaFactura,       
            estadoID: this.estadoID,        
            fallaCliente : this.fallaCliente,       
            fallaStdId : this.fallaStdId,       
            causa: this.causa,
            fotoDestruccionLink: this.fotoDestruccionLink,
            fotoFacturaLink: this.fotoFacturaLink,
            aiFacturaWarn: this.aiFacturaWarn, 
            aiFotoWarn: this.aiFotoWarn,
            aiEsFactura: this.aiEsFactura, 
            aiFechaFactura: this.aiFechaFactura, 
            aiTieneItemValido: this.aiTieneItemValido,
            aiTextoItemValido: this.aiTextoItemValido, 
            aiTextoImagen: this.aiTextoImagen,
        };
    }
}