import express, { response } from "express";
import crypto from "crypto";  // para geração de UUIDs
import morgan from "morgan";

import { users } from "./model/UserModel.js";
import UserController from "./controller/UserController.js";
import UserRouter from "./router/UserRouter.js";

// COMMON JS
// IMPORT -> const express = require("express")
// EXPORT -> module.export = { express: 123 }

// ESMODULES
// IMPORT -> import express from 'express'
// EXPORT -> export { express: 123 } 

const app = express();

app.use(express.json());
// middleware -- intermediário numa requisição

app.use(morgan("combined"));  // biblio de logs

// P/ definir um:
// app.use((request, response, next) =>
// {
//     console.log(request.method, request.url);

//     // Preciso que continue; next chama o próx middleware:
//     next();
// });

app.use("/api", UserRouter);

// Criar serviço p/ o Express ouvir:
app.listen(3000, () => {console.log("Server running on port 3000");});
// (esse log é do lado do servidor, não aparece no browser)