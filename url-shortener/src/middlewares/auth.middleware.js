import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();  // por que está precisando importar fora do index?

const JWT_SECRET = process.env.JWT_SECRET;

export const AuthMiddleware = (request, response, next) =>
{
    const {authorization} = request.headers;

    if ((request.url === "/api/users" &&
        request.method === "POST") ||
        request.url === "/api/login" ||
        !request.url.includes("/api")) 
        // cadastro de usuário, login ou acesso a link
        // não exigem autenticação
        /* What's the best way to test whether a request is a link 
        access? */
    {
        // as regras poderiam estar contidas num arquivo
        next();
    }

    else if (!authorization)
    {
        throw Error("Unauthorized");
    }

    else
    {
        // Por que precisa desse else?
        const [, token] = authorization.split(" ");
        // A 1a palavra é uma convenção, mas raramente é usada
    
        const payload = jwt.verify(token, JWT_SECRET);
        request.loggedUser = payload;
        // Qual é o erro caso seja inválido? Incluir no middleware
        // de error handling
    
        next();
    }
}

// export default AuthMiddleware;
