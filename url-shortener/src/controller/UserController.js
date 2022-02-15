import crypto from "crypto";  // geração de UUIDs
import UserModel from "../model/UserModel.js";

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
POST ou PUT contém os campos necessários (nome, email e senha) e
retorna um booleano conforme o sucesso ou falha da verificação. */
{
    if (body.name && body.email && body.password) { return true; }
    return false;
}

const controller =
{
    // Retorna JSON com todos os usuários:
    index: async (request, response) => 
    {
        const users = await UserModel.find().lean();

        response.json({ users });
    },  // getAll (GET)

    // Retorna JSON com o usuário cujo ID é passado como
    // parâmetro na URL, caso haja:
    getOne: async (request, response) => 
    {
        const { id } = request.params;

        try
        {
            const user = await UserModel.findById(id);

            if (user)
            {
                response.json({ user });
            }

            response.status(404).json({ message: "User not found" });
        }
        catch(error)
        // meio Pokémon, mas é pra não derrubar a aplicação
        {
            console.log(error.message);
            response.status(400).json({ message: "Unexpected error" });
        } 
    },  // GET

    // Insere novo usuário, com ID gerado aleatoriamente:
    store: async (request, response) => 
    {
        // Por que não usar
        // const user = {...request.body, id: crypto.randomUUID()}; ?

        // Porque, não tendo esquema, BD não relacional aceita qqr 
        // chave que seja passada; melhor ser explícito:

        if (!validateUser(request.body))
        {
            response.status(400)
                .send("Incomplete data provided; required fields: name, email and password");
            // não sei se Bad Request seria o mais adequado
        }

        const user = await UserModel.create
        ({
            name: request.body.name, 
            email: request.body.email,
            password: request.body.password,
            phone: request.body.phone // || []
            // (não precisa do ou, se não passar é um array
            // vazio por padrão)
            // como estamos recebendo o(s) telefone(s)?
        });

        response.json({ user });
        
    }, // POST

    /* Outra entrada, p/ copiar e simular POST no Postman:
    {
        "name": "Joana Silva",
        "email": "joana.silva@abc.net"
    }
    */

    // Atualiza a entrada referente ao usuário cujo ID é indicado
    // no body, caso haja:
    // (HW: Retornar usuário atualizado ou 404 com mensagem)
    update: async (request, response) => 
    {
        if (!validateUser(request.body))
        {
            response.status(400)
                .send("Incomplete data provided; required fields: name, email and password. Consider using a PATCH request instead.");
            // não sei se Bad Request seria o mais adequado
        }
        // Incluí essa verificação porque foi dito em aula que o método
        // PUT deveria atualizar todos os campos

        const { id } = request.params;

        const { name, email, password, phone } = request.body;

        try
        {
            const user = await ShortenerModel.findByIdAndUpdate
            (
                id,
                {
                    name,
                    email,
                    password,
                    phone
                },
                { new: true }
                // retorna a versão modificada; cf.
                // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
            );

            response.json( { user });
        }
        catch(error)
        // meio Pokémon, mas é pra não derrubar a aplicação
        {
            console.log(error.message);
            response.status(400).json({ message: "Unexpected error" });
        } 

        // E se tivesse outros campos? Eu deveria aceitar, ou foge
        // ao escopo do PUT?

        // Reciprocamente: se novos campos houvessem sido adicionados
        // posteriormente com o PATCH, o PUT também deveria passar a
        // exigir a atualização deles?
    },  // PUT


    // updateOne: (request, response) =>
    // {
    //     const userIndex = idSearch(request.params.id);

    //     if (userIndex == -1)  // usuário não encontrado
    //     {
    //         return response.status(404).send("User not found");
    //     }

    //     request.body.id = users[userIndex].id;
    //     // P/ não sobrescrever o ID caso o usuário forneça um atributo
    //     // com essa chave (estou presumindo que alterar externamente o 
    //     // ID não seria permitido)

    //     request.body.name = request.body.name || users[userIndex].name;
    //     request.body.email = request.body.email || users[userIndex].email;
    //     // P/ não apagar nome ou email caso o usuário não forneça
    //     // novos valores (estou sempre supondo que esses seriam os
    //     // atributos mínimos obrigatórios)

    //     users[userIndex] = Object.assign(users[userIndex], request.body);
    //     // P/ copiar inclusive outras propriedades passadas

    //     return response.send(users[userIndex]);

    //     // E se tivesse só name e email? Eu deveria aceitar, ou sugerir
    //     // o método PUT nesse caso?

    // },  // PATCH

    // Remove a entrada referente ao usuário cujo ID é indicado
    // no body, caso haja:
    // (HW: Retornar 200 se conseguir deletar ou 404 se não existir)
    remove: async (request, response) => 
    {
        const { id } = request.params;

        try
        {
            const user = await UserModel.findById(id);

            if (user)
            {
                await user.remove();
                // findByIdAndDelete vs ...Remove?

                return response.json({ message: "User removed" });
            }

            response.status(404).json({ message: "User not found" });
        }
        catch(error)
        {
            console.log(error.message);
            response.status(400).json({ message: "Unexpected error" });
        }
        
    }  // DELETE

}

export default controller;