import mongoose from "mongoose";

const ShortenerSchema = mongoose.Schema
(
    {
        link: { type: String, required: true },
        hash: { type: String, required: true },
        expired: { type: Boolean },
        // análogo ao atributo derivado no relacional
        // como eu incluiria um gatilho? ou só no backend?
        expirationDate: Date,
        hits: { type: Number, default: 0, min: 0 },
        // como validariamos que hits >= 0?
        name: String,
        metadata: mongoose.Schema.Types.Mixed
    },
    {
        timestamps: true
    }
);

const ShortenerModel = mongoose.model("shortener", ShortenerSchema);

export default ShortenerModel;