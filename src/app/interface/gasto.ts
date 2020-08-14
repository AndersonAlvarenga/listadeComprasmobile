export interface Gasto {

    "mes": number,
    "ano": number,
    "status": string,
    "valorTotal":number,
    "listaItens": [
        {
            "nome": string,
            "data": Date,
            "tipo": string,
            "quantidade": number,
            "precoUni": number,
            "precoTotal": number
        }
    ],

    "listaCompras": [
        {
            "data": Date,
            "status": string,
            "valorTota": number,
            "item": [{
                "nome": string,
                "tipo": string,
                "quantidade": number,
                "precoUni": number,
                "precoTotal": number

            }]
        }
    ]
}