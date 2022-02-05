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


function idSearch(requestParams)
/* Recebe como argumento um objeto request.params associado a uma
requisição HTTP.

Retorna o índice, na lista de usuários, do usuário com id igual ao 
parâmetro id da requisição. Se esta não incluir um parâmetro id, ou se 
ele for inválido ou inexistente, retorna -1. */
{
    const id = String(requestParams.id);
    
    return id ? users.findIndex(({id: uid}) => uid === id) : -1
    // bastaria retornar o retorno de findIndex, mas estou me precavendo
    // de uma cascata de erros caso haja algum registro inválido com id 
    // undefined
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
        const userIndex = idSearch(request.params);

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

        // console.log(user);
        users.push(user);
        response.send(users);
    })

/* P/ simular POST no Postman:
{
    "name": "Joana Silva",
    "email": "joana.silva@abc.net"
}
*/


// HW: Fazer o PUT e o DELETE (p/ entregar)

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
        response.status(401).send("Hello DELETE");
    })

// Segundo o Keven, isso já é REST

// Criar serviço p/ o Express ouvir:
app.listen(3000, () => {console.log("Server running on port 3000");});
// (esse log é do lado do servidor, não aparece no browser)