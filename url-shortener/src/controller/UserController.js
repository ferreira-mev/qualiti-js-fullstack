import { users } from "../model/UserModel.js";

function idSearch(id)
/* Retorna o índice, na lista de usuários, do usuário com id igual ao 
parâmetro id da requisição. Se esta não incluir um parâmetro id, ou se 
ele for inválido ou inexistente, retorna -1. */
{
    return users.findIndex(({id: uid}) => uid === String(id));
    // (só pra não precisar ficar escrevendo isso :P)
}

const controller =
{
    index: (request, response) => 
    {
        response.send(users);
    },  // getAll

    getOne: (request, response) => 
    {
        const userIndex = idSearch(request.params.id);

        if (userIndex > -1)  // usuário encontrado
        {
            return response.send(users[userIndex]);
        }

        return response.status(404).send("User not found");
    },
    store: (request, response) => 
    {
        // Por que não usar
        // const user = {...request.body, id: crypto.randomUUID()}; ?

        // Não tendo esquema, BD não relacional aceita qqr chave que 
        // seja passada; melhor ser explícito:

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
        const userIndex = idSearch(request.body.id);

        if (userIndex > -1)  // usuário encontrado
        {
            users[userIndex].name = request.body.name;
            users[userIndex].email = request.body.email;

            return response.send(users[userIndex]);
        }

        return response.status(404).send("User not found");
    },  //PUT
    remove: (request, response) => 
    {
        const userIndex = idSearch(request.body.id);

        if (userIndex > -1)  // usuário encontrado
        {
            users.splice(userIndex, 1);

            return response.send("User " + request.body.id + " deleted");
            // (como teve sucesso, retorna 200 por padrão; não precisa
            // incluir status(200))
        }

        return response.status(404).send("User not found");
    }  // DELETE

}

export default controller;