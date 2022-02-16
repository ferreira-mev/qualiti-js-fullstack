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

app.use("/api", UserRouter);
app.use(ShortenerRouter);

// Error handling middleware:
// (o Pokémon que impede que a aplicação seja derrubada)

// DISCLAIMER: Fiz isso um pouco correndo, para já deixar pronto
// antes de uma aula, e sem ter prática; reconheço que ainda não
// está da forma ideal (ver TODOs), mas já é melhor que colocar 
// try... catch em todos os métodos das classes controladoras, ou 
// que não tratar
app.use((error, request, response, next) =>
{
    // TODO: tratar mais tipos de erros
    // TODO: criar classes p/ os tipos?
    // https://javascript.info/custom-errors
    // (ao menos não ter as strings hardcoded já ajudaria...)

    console.log("The error handling middleware has caught the" +
        " following error:");
    
    if (error.stack) { console.log(error.stack); }
    // nem sempre está disponível
    else { console.log(error.name + ": " + error.message); }
    // (a stack já começa com essa linha)

    // Respostas a tipos de erros:

    if (error.message === "User not found" || 
        error.message === "Invalid ID; user not found" ||
        error.message === "Link not found")
    {
        return response.status(404).json({ message: error.message });
    }

    if (error.name === "ValidationError" ||
        error.message === "Sorry, this link had expired")
    {
        return response.status(403).json({ message: error.message });
        // Qual seria o código de erro mais adequado aqui?
    }

    // Resposta genérica:
    response.status(500).json({ message: "Unexpected error" });
});

// Criar serviço p/ o Express ouvir:
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`);});
// (esses logs no console são do lado do servidor, não aparecem no 
// browser)

// P/ conseguir acessar por um "alias": /etc/hosts