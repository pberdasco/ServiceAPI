export default class CasoItem{
    id;                 //int
    casoId;             //int
    fila;               //int
    tipoProductoId;     //int
    prouctoId;          //int
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
        this.tipoProductoId = item.tipoProductoId;     
        this.productoId = item.productoId;          
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
    }

    toJson(){
        return {
            id: this.id,
            casoId: this.casoId,             
            fila: this.fila,               
            tipoProductoId: this.tipoProductoId,     
            productoId: this.productoId,         
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
        };
    }
}