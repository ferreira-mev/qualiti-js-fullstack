import crypto from "crypto";  // geração de UUIDs
import { nextTick } from "process";

import UserModel from "../model/UserModel.js";

class UserController
{
    // Retorna JSON com todos os usuários:
    async index(request, response) 
    {
        const users = await UserModel.find().lean();

        response.json({ users });
    }  // getAll (GET)

    // Retorna JSON com o usuário cujo ID é passado como
    // parâmetro na URL, caso haja:
    async getOne(request, response) 
    {
        const { id } = request.params;
        
        const user = await UserModel.findById(id);
        
        if (!user)
        {
            throw Error("Not found");
        }

        response.json({ user });
    }  // GET

    // Insere novo usuário, com ID gerado aleatoriamente:
    async store(request, response) 
    {
        // Por que não usar
        // const user = {...request.body, id: crypto.randomUUID()}; ?

        // Porque, não tendo esquema, BD não relacional aceita qqr 
        // chave que seja passada; melhor ser explícito:

        const user = await UserModel.create
        ({
            name: request.body.name, 
            email: request.body.email,
            password: request.body.password,
            phones: request.body.phones // || []
            // (não precisa do ou, se não passar é um array
            // vazio por padrão)
            // como estamos recebendo o(s) telefone(s)?
        });

        response.json({ user });
        
    } // POST

    // Atualiza a entrada referente ao usuário cujo ID é indicado
    // no body, caso haja:
    // (HW: Retornar usuário atualizado ou 404 com mensagem)
    async update(request, response, next)
    {
        // Obs: foi dito em aula que o método PUT deveria atualizar 
        // todos os campos; para atualizar apenas alguns, o método
        // seria o PATCH

        const { id } = request.params;

        const { name, email, password, phones } = request.body;

        const user = await UserModel.findByIdAndUpdate
        (
            id,
            {
                name,
                email,
                password,
                phones
            },
            { new: true }
            // retorna a versão modificada; cf.
            // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
        );

        response.json( { user }); 
    }  // PUT


    // updateOne: (request, response) =>
    // {
    //     const userIndex = idSearch(request.params.id);

    //     if (userIndex == -1)  // usuário não encontrado
    //     {
    //         return response.status(404).send("Not found");
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
    async remove(request, response) 
    {
        const { id } = request.params;

        const user = await UserModel.findById(id);

        if (!user)
        {
            throw Error("Not found");
        }

        await user.remove();
        // findByIdAndDelete vs ...Remove?

        return response.json({ message: "User removed" });
        
    }  // DELETE

}

export default UserController;