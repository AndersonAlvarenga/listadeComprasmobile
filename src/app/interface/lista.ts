export interface ListaCompras {
    "data": Date,
    "status": string,
    "valorTota": number,
    "item": [
        {
            "nome": string,
            "tipo": string,
            "quantidade": number,
            "precoUni": number,
            "precoTotal": number
        }
    ]
}