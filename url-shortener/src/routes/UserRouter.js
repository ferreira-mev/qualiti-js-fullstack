import { Router } from "express";

import UserController from "../controller/UserController.js";

const router = Router();

// Retorna JSON com todos os usuários:
router.get("/user", UserController.index)

// Retorna JSON com o usuário cujo ID é passado como
// parâmetro na URL, caso haja:
router.get("/user/:id", UserController.getOne)

// Insere novo usuário, com ID gerado aleatoriamente:
router.post("/user", UserController.store)

/* Outra entrada, p/ copiar e simular POST no Postman:
{
    "name": "Joana Silva",
    "email": 
*/

// Atualiza a entrada referente ao usuário cujo ID é indicado
// no body, caso haja:
// (HW: Retornar usuário atualizado ou 404 com mensagem)
router.put("/user", UserController.update)


// Remove a entrada referente ao usuário cujo ID é indicado
// no body, caso haja:
// (HW: Retornar 200 se conseguir deletar ou 404 se não existir)
router.delete("/user", UserController.remove)

export default router;