import express, { response } from "express";
import crypto from "crypto";  // para geração de UUIDs

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

app.use(express.json());  // middleware

app.use("/api", UserRouter);



// Criar serviço p/ o Express ouvir:
app.listen(3000, () => {console.log("Server running on port 3000");});
// (esse log é do lado do servidor, não aparece no browser)