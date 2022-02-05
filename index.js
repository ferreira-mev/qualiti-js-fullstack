import express, { response } from "express";
import crypto from "crypto";  // geração de UUIDs

// COMMON JS
// IMPORT > const express = require("express")
// EXPORT -> module.export = { express: 123 }

// ESMODULES
// IMPORT -> import express from 'express'
// EXPORT -> export { express: 123 } 

const app = express();

app.use(express.json());  // middleware

let users = [
    {
        id: 1,
        name: "Eduarda Ferreira",
        email: "eduarda@ferreira.com"
        
    },
    {
        id: 2,
        name: "Keven Leone",
        email: "keven@leone.com"
    }
]

app.get("/api/user", 
    (request, response, next) => 
    {
        response.send(users);
    })

app.get("/api/user/:id", 
    (request, response, next) => 
    {
        const id = Number(request.params.id);  // normalização
        const user = users.find(({id: uid}) => uid === id);
        // desestruturou o 1o parâmetro (user)

        if (user)
        {
            return response.send(user);
        }

        return response.status(404).send("User not found");
        
    })

app.post("/api/user", 
    (request, response) => 
    {
        // const user = {...request.body, id: crypto.randomUUID()};
        // Não tendo esquema, BD não relacional aceita qqr chave que 
        // seja passada; melhor ser explícito:

        const user = 
        {
            name: request.body.name, 
            email: request.body.email,
            id: crypto.randomUUID()
        };

        // console.log(user);
        users.push(user);
        response.send(users);
    })

/* P/ simular POST:
{
    "name": "Joana Silva",
    "email": "joana.silva@abc.net"
}
*/

// HW: Fazer o PUT e o DELETE (p/ entregar)

// Atualiza um valor:
app.put("/api/user/:id", 
    (request, response, next) => 
    {
        response.send("Hello PUT");
    })

app.delete("/api/user", 
    (request, response, next) => 
    {
        response.status(401).send("Hello DELETE");
    })

// Segundo o Keven, isso já é um REST

// Criar serviço p/ o Express ouvir:
app.listen(3000, () => {console.log("Server running on port 3000");});
// (esse log é do lado do servidor, não aparece no browser)