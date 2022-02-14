import crypto from "crypto";
import userAgent from "user-agent";

import ShortenerModel from "../model/ShortenerModel.js";

class ShortenerController
{
    async index(request, response)
    {
        const shortenedLinks = await ShortenerModel.find().lean();
        // esse find é uma promise

        response.json({ shortenedLinks });
    }

    async getOne(request, response) 
    {
        const { id } = request.params;

        try
        {
            const shortenedLink = await ShortenerModel.findById(id);

            if (shortenedLink)
            {
                response.json({ shortenedLink });
            }

            response.status(404).json({ message: "Link not found" });
        }
        catch(error)
        // meio Pokémon, mas é pra não derrubar a aplicação
        {
            console.log(error.message);
            response.status(400).json({ message: "Unexpected error" });
        } 
    }

    async store(request, response)
    {
        try
        {
            const { link, name, expirationDate } = request.body;

            const [hash] = crypto.randomUUID().split("-");

            const shortenedLink = await ShortenerModel.create
            ({
                hash,
                link,
                name,
                expirationDate,
                metadata: []
            });

            response.json({ shortenedLink });
        }
        catch(error)
        {
            console.log(error.message);
            response.status(400).json({ message: "Unexpected error" });
        }
        
    }

    async update(request, response)
    {
        const { id } = request.params;
        const { link, name, expirationDate } = request.body;

        try
        {
            const shortenedLink = await ShortenerModel.findByIdAndUpdate
            (
                id,
                {
                    link,
                    name,
                    expirationDate
                },
                { new: true }
                // retorna a versão modificada; cf.
                // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
            );

            response.json( { shortenedLink });
        }
        catch(error)
        // meio Pokémon, mas é pra não derrubar a aplicação
        {
            console.log(error.message);
            response.status(400).json({ message: "Unexpected error" });
        } 
    }

    async remove(request, response) 
    {
        const { id } = request.params;

        try
        {
            const shortenedLink = await ShortenerModel.findById(id);

            if (shortenedLink)
            {
                await shortenedLink.remove();
                // findByIdAndDelete vs ...Remove?

                return response.json({ message: "Link removed" });
                /* Um erro ilustrativo: sem o return acima, acontecia

                Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

                (Ele tentava seguir com o response.json abaixo depois de passar por aqui; o lado ruim do if sem else é ter que dar atenção redobrada a essas coisas.)
                */
            }

            response.status(404).json({ message: "Link not found" });
        }
        catch(error)
        {
            console.log(error.message);
            response.status(400).json({ message: "Unexpected error" });
        }
    }

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
        // parâmetros a buscar no objeto-argumento

        if (shortenedLink)
        {
            if (shortenedLink.expired)
            {
                return response.status(400).json({ message: "Sorry, this link had expired" });
            }

            shortenedLink.hits++;
            shortenedLink.metadata.push(metadata);

            await shortenedLink.save();

            return response.redirect(shortenedLink.link);
        }

        response.status(404).json({ message: "Not found" });
        
    }
}

export default ShortenerController;

/*

{
    "expirationDate": "2022-02-09T23:00:20.046Z",
    "link": "https://www.github.com",
    "name": "GitHub"
}
Obs: Esse formato de data é o ISO.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
*/
