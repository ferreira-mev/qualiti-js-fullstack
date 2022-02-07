import { Router } from "express";

import UserController from "../controller/UserController.js";

const router = Router();

// Retorna JSON com todos os usuários:
router.get("/user", 
    (request, response) => 
    {
        UserController.index(request, response);
    })

// Retorna JSON com o usuário cujo ID é passado como
// parâmetro na URL, caso haja:
router.get("/user/:id", 
    (request, response) => 
    {
        UserController.getOne(request, response);
    })

// Insere novo usuário, com ID gerado aleatoriamente:
router.post("/user", 
    (request, response) => 
    {
        UserController.store(request, response);
    })

/* Outra entrada, p/ copiar e simular POST no Postman:
{
    "name": "Joana Silva",
    "email": "joana.silva@abc.net"
}
*/

// Atualiza a entrada referente ao usuário cujo ID é indicado
// no body, caso haja:
// (HW: Retornar usuário atualizado ou 404 com mensagem)
router.put("/user", 
    (request, response) => 
    {
        UserController.update(request, response);
    })


// Remove a entrada referente ao usuário cujo ID é indicado
// no body, caso haja:
// (HW: Retornar 200 se conseguir deletar ou 404 se não existir)
router.delete("/user", 
    (request, response) => 
    {
        UserController.remove(request, response);
    })

export default router;