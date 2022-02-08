import ShortenerModel from "../model/ShortenerModel.js";

class ShortenerController
{
    async index (request, response)
    {
        const shorteners = await ShortenerModel.find().lean();
        // esse find é uma promise

        response.json({shorteners});
    }

    getOne (request, response) {}

    async store (request, response)
    {
        const body = request.body;

        const shortener = await ShortenerModel.create(body);

        response.json({shortener});
    }

    update (request, response) {}
    remove (request, response) {}
}

export default ShortenerController;