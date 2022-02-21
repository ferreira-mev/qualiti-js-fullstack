import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import UserModel from "../model/UserModel.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
// dentro ou fora da classe?

class UserController
{
    static async hashPassword(password)
    {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hash(password, salt);

        return hash;

        // Além do reuso e da abstração (ex: facilitando trocas),
        // ter uma função separada tb é bom p/ testes unitários
    }

    // Retorna JSON com todos os usuários:
    // (Para fins didáticos e de debug, já que nenhum usuário deveria
    // ter esse nível de acesso)
    async index(request, response) 
    {
        const users = await UserModel.find().lean();

        response.json({ users });
    }  // getAll (GET)

    // Consulta do usuário ao próprio cadastro:
    async getOne(request, response) 
    {
        const { id } = request.params;
        
        const user = await UserModel.findById(id);
        
        if (!user || user._id != request.loggedUser._id)
        {
            throw Error("Not found");
        }

        response.json({ user });
    }  // GET
    // Insere novo usuário (cadastro), com ID gerado aleatoriamente:
    async store(request, response) 
    {
        // Por que não usar
        // const user = {...request.body}; ?

        // Porque, não tendo esquema, BD não relacional aceita qqr 
        // chave que seja passada; melhor ser explícito:

        const user = await UserModel.create
        ({
            name: request.body.name, 
            email: request.body.email,
            password: await UserController.hashPassword(request.body.password),
            phones: request.body.phones // || []
            // (não precisa do ou comentado acima; se não passar é um
            // array vazio por padrão)
        });

        response.json({ user });        
    } // POST

    // Atualização de cadastro:
    async update(request, response, next)
    {
        // Obs: foi dito em aula que o método PUT deveria atualizar 
        // todos os campos; para atualizar apenas alguns, o método
        // seria o PATCH

        const { name, email, password, phones } = request.body;

        const user = await UserModel.findByIdAndUpdate
        (
            request.loggedUser._id,
            {
                name,
                email,
                password: await UserController.hashPassword(password),
                phones
            },
            { new: true }
            // retorna a versão modificada; cf.
            // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
        );

        response.json( { user });

        // O que acontece se não achar, p/ eu usar 404?
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

    // Remoção de cadastro:
    async remove(request, response) 
    {
        const user = await UserModel.findById(request.loggedUser._id);

        if (!user)
        {
            throw Error("Not found");
        }

        await user.remove();
        // findByIdAndDelete vs ...Remove?

        return response.json({ message: "User removed" });
        
    }  // DELETE

    async login(request, response)
    {
        const { email, password } = request.body;

        // Avisar se o erro está na senha ou no
        // usuário é falha de segurança; "por fins didáticos" 
        // (- tio Keven), vamos falhar

        const user = await UserModel.findOne({ "email": email }).lean();
        // lean() extrai o que é interno ao mongoose e extrai apenas os
        // dados

        if (!user)
        {
            return response.status(404).json({ message: "User does not exist" });

            // (Eu deveria jogar isso p/ o middleware que é handler
            // geral?)
            // (Acho que por enquanto não, porque não quero criar essas
            // categorias de erro definitivamente; pretendo dar refactor
            // pra forma mais segura)
        }

        if (!bcrypt.compareSync(password, user.password))
        {
            return response.status(401).json({ message: "Wrong password" });
        }

        delete user.password;

        const token = jwt.sign(user, JWT_SECRET);
        // O token está em base 64 e fica armazenado no cliente, podendo
        // ser facilmente convertido p/ um formato human readable (ex:
        // jwt.io); então, não deve conter informações sensíveis como a
        // senha, mesmo que hasheada com salt.

        // Por outro lado, uma vantagem disso é que essas informações
        // ficam acessíveis no front-end -- mas, pelo primeiro lado,
        // quanto mais info, maior o token (é claro).

        // Outro problema de segurança: nosso token atualmente não 
        // expira.

        return response.send({token});
        
    }

    // (API não costuma ter logout, só front-end)

}

export default UserController;

/* P/ fins de testagem manual:

(pw 12345)
"user": {
        "_id": "6213dc130ce1984bfeaf5ec8",
        "name": "Eduarda Ferreira",
        "email": "eduarda@ferreira.com",
        "role": "user",
        "password": "$2a$10$amadrOZWlNtVWUcyl4fJaelOTeKpg.O2415RFpgq1gCaQlhnlDaV6",
        "phones": [
            "8034-901-12",
            "93032-5403"
        ],
        "createdAt": "2022-02-21T18:38:11.469Z",
        "updatedAt": "2022-02-21T18:44:33.440Z",
        "__v": 0
    }

{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjEzZGMxMzBjZTE5ODRiZmVhZjVlYzgiLCJuYW1lIjoiRWR1YXJkYSBGZXJyZWlyYSIsImVtYWlsIjoiZWR1YXJkYUBmZXJyZWlyYS5jb20iLCJyb2xlIjoidXNlciIsInBob25lcyI6WyI4MDM0LTkwMS0xMiJdLCJjcmVhdGVkQXQiOiIyMDIyLTAyLTIxVDE4OjM4OjExLjQ2OVoiLCJ1cGRhdGVkQXQiOiIyMDIyLTAyLTIxVDE4OjM4OjExLjQ2OVoiLCJfX3YiOjAsImlhdCI6MTY0NTQ2ODk3M30.iZtckG4Fr3mjGwKrc5HjPoR_NGh8mZ6aG8fKQyb3fmQ"
}

*/