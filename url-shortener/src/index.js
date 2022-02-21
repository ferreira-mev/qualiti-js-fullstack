import express from "express";
import morgan from "morgan";  // logs
import mongoose from "mongoose";  // conexão com MongoDB
import dotenv from "dotenv";  // variáveis de ambiente
import expressAsyncErrors from "express-async-errors";
/* - https://www.npmjs.com/package/express-async-errors
- https://stackoverflow.com/questions/51391080/handling-errors-in-express-async-middleware
- https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/ (not
on this specific lib, but instructive nonetheless)
*/

import UserRouter from "./routes/UserRouter.js";
import ShortenerRouter from "./routes/ShortenerRouter.js";
import {AuthMiddleware} from "./middlewares/auth.middleware.js";
import ErrorHandler from "./middlewares/errors.middleware.js";

// COMMON JS
// IMPORT -> const express = require("express")
// EXPORT -> module.export = { express: 123 }

// ESMODULES
// IMPORT -> import express from 'express'
// EXPORT -> export { express: 123 } 

// Não é boa prática colocar informações sensíveis,
// como o endereço do banco, hardcoded; movemos para o .env
dotenv.config();
// Obs: A documentação do dotenv diz que o arquivo .env deve
// estar na raiz do projeto; por experiência, parece que ele só
// é lido se eu rodar o nodemon a partir do que diretório que
// contém o .env, independentemente de como esteja a estrutura
// dos diretórios, então acho que a "raiz do projeto" é definida
// dessa forma.

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

app.use(AuthMiddleware);
app.use("/api", UserRouter);
app.use(ShortenerRouter);
app.use(ErrorHandler);

// Criar serviço p/ o Express ouvir:
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});
// (esses logs no console são do lado do servidor, não aparecem no 
// browser)

// P/ conseguir acessar por um "alias": /etc/hosts