export default class Historias{
    tipo;        // "Caso", "Item", "OT"
    lista = [];  // {id: , usuarioId:, elementoId:, fecha:, campo:, valorViejo:, valorNuevo}

    constructor(tipo, lista){
        this.tipo = tipo;
        lista.forEach((x) => {
            this.lista.push({
                id,
                usuarioId,
                elementoId,
                fecha,
                campo,
                valorViejo,
                valorNuevo
            });
        });
    }

}