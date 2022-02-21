import crypto from "crypto";
import userAgent from "user-agent";

import ShortenerModel from "../model/ShortenerModel.js";

class ShortenerController
{
    async index(request, response)
    {
        const shortenedLinks = await ShortenerModel.find
        (
            { user: request.loggedUser._id }
            // apenas os links criados pelo usuário logado
        ).lean();

        response.json({ shortenedLinks });
    }  // GET (all)

    async getOne(request, response) 
    {
        const { id } = request.params;

        const shortenedLink = await ShortenerModel.findById(id);

        if (!shortenedLink || shortenedLink.user != request.loggedUser._id)
        {
            throw Error("Not found");
        }

        return response.json({ shortenedLink });   
    }  // GET (one)

    async store(request, response)
    {
        const { link, name, expirationDate } = request.body;

        const [hash] = crypto.randomUUID().split("-");
        // Usando só a primeira parte para não ficar tão grande;
        // como é para fins didáticos e não um site com milhões de
        // usuários, não estamos analisando a probabilidade de colisões
        // para chegar ao método ideal

        const shortenedLink = await ShortenerModel.create
        ({
            hash,
            link,
            name,
            user: request.loggedUser._id,
            // TODO: What happens if a user who is not logged in tries to shorten a link? I should catch this
            expirationDate,
            metadata: []
        });

        response.json({ shortenedLink });
    }  // POST

    async update(request, response)
    {
        const { id } = request.params;
        const { link, name, expirationDate } = request.body;

        const shortenedLink = await ShortenerModel.findOneAndUpdate
        (
            {
                "_id": id,
                "user": request.loggedUser._id
            },
            {
                link,
                name,
                expirationDate
            },
            { new: true }
            // retorna a versão modificada; cf.
            // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
        );

        if (!shortenedLink)
        {
            throw Error("Not found");
        }

        // (me parece mais seguro tratar "link não é seu" igual a
        // "link não encontrado"; assim, um usuário malicioso sequer 
        // saberia se o ID em questão corresponde a algo existente no
        // banco de dados)

        response.json( { shortenedLink });
    }  // PUT

    async remove(request, response) 
    {
        const { id } = request.params;

        const shortenedLink = await ShortenerModel.findById(id);

        if (!shortenedLink || shortenedLink.user != request.loggedUser._id)
        {
            throw Error("Not found");
        }

        await shortenedLink.remove();

        return response.json({ message: "Link removed" });
    }  // DELETE

    // Redireciona do link encurtado p/ o link original
    async redirect(request, response)
    {
        const { hash } = request.params;

        const userAgentData = userAgent.parse(request.headers["user-agent"]);

        const metadata = 
        {
            ip: request.ip,
            langs: request.headers["accept-language"],
            userAgent: userAgentData
        };

        const shortenedLink = await ShortenerModel.findOne({ hash });
        // Sem controle de acesso aqui, porque o link é para ser
        // publicamente acessível

        if (!shortenedLink)
        {
            throw Error("Not found");
        }

        if (shortenedLink.expired)
        {
            throw Error("Sorry, this link had expired");
        }

        shortenedLink.hits++;
        shortenedLink.metadata.push(metadata);

        await shortenedLink.save();

        return response.redirect(shortenedLink.link);    
    }  // GET (link)
}

export default ShortenerController;

/* For manual testing:

"shortenedLink": {
        "link": "https://www.github.com",
        "hash": "fa4f179a",
        "user": "6213dc130ce1984bfeaf5ec8",
        "expired": false,
        "expirationDate": "2022-02-09T23:00:20.046Z",
        "hits": 0,
        "name": "GitHub",
        "metadata": [],
        "_id": "6213dff08526a241f00099da",
        "createdAt": "2022-02-21T18:54:40.770Z",
        "updatedAt": "2022-02-21T18:54:40.770Z",
        "__v": 0
    }

Note: This date format is ISO.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
*/
