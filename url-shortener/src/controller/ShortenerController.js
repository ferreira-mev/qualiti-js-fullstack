import crypto from "crypto";
import userAgent from "user-agent";

import ShortenerModel from "../model/ShortenerModel.js";

class ShortenerController
{
    async index(request, response)
    {
        const shortenedLinks = await ShortenerModel.find().lean();

        response.json({ shortenedLinks });
    }

    async getOne(request, response) 
    {
        const { id } = request.params;

        const shortenedLink = await ShortenerModel.findById(id);

        if (!shortenedLink)
        {
            throw Error("Not found");
        }

        return response.json({ shortenedLink });   
    }

    async store(request, response)
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

    async update(request, response)
    {
        const { id } = request.params;
        const { link, name, expirationDate } = request.body;

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

        // O que acontece se não achar? P/ eu usar 404
        response.json( { shortenedLink });
    }

    async remove(request, response) 
    {
        const { id } = request.params;

        const shortenedLink = await ShortenerModel.findById(id);

        if (!shortenedLink)
        {
            throw Error("Not found");
        }

        await shortenedLink.remove();
        // findByIdAndDelete vs ...Remove?

        return response.json({ message: "Link removed" });
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
