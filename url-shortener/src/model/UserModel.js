import mongoose from "mongoose";

const UserSchema = mongoose.Schema
(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, lowercase: true },
        role: 
        { 
            type: String, 
            required: true, 
            lowercase: true,
            enum: ["user", "administrator"],
            default: "user" 
        },
        // (deixei email e role em lowercase pra facilitar comparações)
        password: { type: String, required: true },
        phones: [{ type: String }]
        // Could I use regex here to ensure these contain numbers,
        // dashes, spaces and parentheses only, or -- better yet --
        // to specify a format?
    },
    {
        timestamps: true,
        runValidators: true  // por conta da enum
        // https://github.com/Automattic/mongoose/issues/1974
        // https://mongoosejs.com/docs/validation.html#update-validators
        // "Be careful: update validators are off by default 
        // because they have several caveats." Hmm; like what?
    }
);
  
const UserModel = mongoose.model("user", UserSchema);

export default UserModel;