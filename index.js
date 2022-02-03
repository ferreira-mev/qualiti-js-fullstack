// const express = require("express");  // common JS
import express, { response } from "express";  // ES Modules

// COMMON JS ->
// IMPORT > const express = require("express")
// EXPORT -> module.export = { express: 123 }

// ESMODULES
// IMPORT -> import express from 'express'
// EXPORT -> export { express: 123 } 

const app = express();

let users = [
    {
        id: 1,
        name: "Eduarda Ferreira",
        email: "dudz@dudz.com"
        
    },
    {
        id: 2,
        name: "Zé Zin",
        email: "ziin@hotmail.com"
        
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
    (request, response, next) => 
    {
        console.log(request.body);
        response.send(request);
    })

app.put("/api/user", 
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
// esse log é do lado do servidor, não aparece no browser