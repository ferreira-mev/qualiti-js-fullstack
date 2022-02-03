// const express = require("express");  // common JS
import express from "express";  // ES Modules

// COMMON JS ->
// IMPORT > const express = require("express")
// EXPORT -> module.export = { express: 123 }

// ESMODULES
// IMPORT -> import express from 'express'
// EXPORT -> export { express: 123 } 

const app = express();

app.get("/api/user", 
    (request, response, next) => 
    {
        response.send("Hello GET");
    })

app.post("/api/user", 
    (request, response, next) => 
    {
        response.send("Hello POST");
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