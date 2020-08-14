
export interface UserLista {
    "id": {
        "nome": string,
        "senha": string,
        "email": string,
        "gastosMensais": [
            {
                "mes": string,
                "ano": number,
                "status": string,
                

            }
        ]
    }
}