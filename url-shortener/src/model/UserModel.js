import mongoose from "mongoose";

// "Minibase de dados" pra testar:
// export const users = [
//     {
//         id: "1",
//         name: "Eduarda Ferreira",
//         email: "eduarda@ferreira.com"
        
//     },
//     {
//         id: "2",
//         name: "Keven Leone",
//         email: "keven@leone.com"
//     }
// ];

// Estou inicializando com IDs bobos aqui em vez de gerar
// pelo crypto.randomUUID() para facilitar a testagem do GET,
// PUT e DELETE

const UserSchema = mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      role: 
      { 
          type: String, 
          required: true, 
          enum: ["User", "Administrator"],
          default: "User" 
    },
      password: { type: String, required: true },
      phone: [{ type: String }],
    },
    {
      timestamps: true,
    }
  );
  
const UserModel = mongoose.model("user", UserSchema);


// Name, Email, Role: Administrator / User, Password, Created At, Modified At, Phones: 123, 123 

export default UserModel;