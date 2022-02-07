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


function idSearch(id)
/* Retorna o índice, na lista de usuários, do usuário com id igual ao 
parâmetro id da requisição. Se esta não incluir um parâmetro id, ou se 
ele for inválido ou inexistente, retorna -1. */
{
    return users.findIndex(({id: uid}) => uid === String(id));
}


let users = [
    {
        id: "1",
        name: "Eduarda Ferreira",
        email: "eduarda@ferreira.com"
        
    },
    {
        id: "2",
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
        const userIndex = idSearch(request.params.id);

        if (userIndex > -1)  // usuário encontrado
        {
            return response.send(users[userIndex]);
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

        users.push(user);
        response.send(users);
    })

/* P/ simular POST no Postman:
{
    "name": "Joana Silva",
    "email": "joana.silva@abc.net"
}
*/

// Atualiza um valor:
// (HW: Retornar usuário atualizado ou 404 com mensagem)
app.put("/api/user", 
    (request, response, next) => 
    {
        const userIndex = idSearch(request.body.id);

        if (userIndex > -1)  // usuário encontrado
        {
            users[userIndex].name = request.body.name;
            users[userIndex].email = request.body.email;

            return response.send(users[userIndex]);
        }

        return response.status(404).send("User not found");
    })

// (HW: Retornar 200 se conseguir deletar ou 404 se não existir)
app.delete("/api/user", 
    (request, response, next) => 
    {
        const userIndex = idSearch(request.body.id);

        if (userIndex > -1)  // usuário encontrado
        {
            users.splice(userIndex, 1);

            return response.send("User " + request.body.id + " deleted");
            // (como teve sucesso, retorna 200 por padrão; não precisa
            // incluir status(200))
        }

        return response.status(404).send("User not found");
    })

// Segundo o Keven, isso já é REST

// Criar serviço p/ o Express ouvir:
app.listen(3000, () => {console.log("Server running on port 3000");});
// (esse log é do lado do servidor, não aparece no browser)