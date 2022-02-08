import mongoose from "mongoose";

const ShortenerSchema = mongoose.Schema
(
    {
        name: String
        // to be continued
    }
);

const ShortenerModel = mongoose.model("shortener", ShortenerSchema);

export default ShortenerModel;