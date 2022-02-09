import crypto from "crypto";  // geração de UUIDs
import { users } from "../model/UserModel.js";

function idSearch(id)
/* Retorna o índice, na lista de usuários, do usuário com id igual ao 
parâmetro id da requisição. Se esta não incluir um parâmetro id, ou se 
ele for inválido ou inexistente, retorna -1. */
{
    return users.findIndex(({id: uid}) => uid === String(id));
    // (só pra não precisar ficar escrevendo isso :P)
}

function validateUser(body)
/* Verifica se o JSON do usuário fornecido no corpo de uma requisição
POST ou PUT contém os campos necessários (nome e email) e retorna um
booleano conforme o sucesso ou falha da verificação. */
{
    if (body.name && body.email) { return true; }
    return false;
}

const controller =
{
    index: (request, response) => 
    {
        response.send(users);
    },  // getAll (GET)

    getOne: (request, response) => 
    {
        const userIndex = idSearch(request.params.id);

        if (userIndex > -1)  // usuário encontrado
        {
            return response.send(users[userIndex]);
        }

        return response.status(404).send("User not found");
    },  // GET

    store: (request, response) => 
    {
        // Por que não usar
        // const user = {...request.body, id: crypto.randomUUID()}; ?

        // Porque, não tendo esquema, BD não relacional aceita qqr 
        // chave que seja passada; melhor ser explícito:

        if (!validateUser(request.body))
        {
            response.status(400)
                .send("Incomplete data provided; required fields: name and email");
            // não sei se Bad Request seria o mais adequado
        }

        const user = 
        {
            name: request.body.name, 
            email: request.body.email,
            id: crypto.randomUUID()
        };

        users.push(user);
        response.send(users);
        
    }, // POST

    update: (request, response) => 
    {
        if (!validateUser(request.body))
        {
            response.status(400)
                .send("Incomplete data provided; required fields: name and email. Consider using a PATCH request instead.");
            // não sei se Bad Request seria o mais adequado
        }

        const userIndex = idSearch(request.params.id);

        if (userIndex == -1)  // usuário não encontrado
        {
            return response.status(404).send("User not found");
        }

        users[userIndex].name = request.body.name;
        users[userIndex].email = request.body.email;

        // E se tivesse outros campos? Eu deveria aceitar, ou foge
        // ao escopo do PUT?

        return response.send(users[userIndex]);
    },  // PUT

    updateOne: (request, response) =>
    {
        const userIndex = idSearch(request.params.id);

        if (userIndex == -1)  // usuário não encontrado
        {
            return response.status(404).send("User not found");
        }

        request.body.id = users[userIndex].id;
        // P/ não sobrescrever o ID caso o usuário forneça um atributo
        // com essa chave (estou presumindo que alterar externamente o 
        // ID não seria permitido)

        request.body.name = request.body.name || users[userIndex].name;
        request.body.email = request.body.email || users[userIndex].email;
        // P/ não apagar nome ou email caso o usuário não forneça
        // novos valores (estou sempre supondo que esses seriam os
        // atributos mínimos obrigatórios)

        users[userIndex] = Object.assign(users[userIndex], request.body);
        // P/ copiar inclusive outras propriedades passadas

        return response.send(users[userIndex]);

        // E se tivesse só name e email? Eu deveria aceitar, ou sugerir
        // o método PUT nesse caso?

    },  // PATCH

    remove: (request, response) => 
    {
        const userIndex = idSearch(request.params.id);

        if (userIndex == -1)  // usuário não encontrado
        {
            return response.status(404).send("User not found");
        }

        users.splice(userIndex, 1);

        return response.send("User " + request.params.id + " deleted");
        // (como teve sucesso, retorna 200 por padrão; não precisa
        // incluir status(200))
        
    }  // DELETE

}

export default controller;