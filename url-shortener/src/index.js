import express from "express";
import morgan from "morgan";  // logs
import mongoose from "mongoose";  // conexão com MongoDB
import dotenv from "dotenv";  // variáveis de ambiente

import UserRouter from "./routes/UserRouter.js";
import ShortenerRouter from "./routes/ShortenerRouter.js";

// COMMON JS
// IMPORT -> const express = require("express")
// EXPORT -> module.export = { express: 123 }

// ESMODULES
// IMPORT -> import express from 'express'
// EXPORT -> export { express: 123 } 

// Não é boa prática colocar informações sensíveis,
// como o endereço do banco, hardcoded; movemos para o .env
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;

mongoose
    .connect(DATABASE_URL)
    .then
    (
        () => { console.log("MongoDB connected"); }
    )
    .catch
    (
        (error) => { console.log(error); }
    );
// (é uma promise)

const app = express();

app.use(express.json());
// middleware -- intermediário numa requisição

app.use(morgan("dev"));

// P/ definir um middleware:
// app.use((request, response, next) =>
// {
//     console.log(request.method, request.url);

//     // Preciso que continue; next chama o próx middleware:
//     next();
// });

app.use("/api", UserRouter);
app.use("/api", ShortenerRouter);

// Criar serviço p/ o Express ouvir:
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});
// (esse log é do lado do servidor, não aparece no browser)