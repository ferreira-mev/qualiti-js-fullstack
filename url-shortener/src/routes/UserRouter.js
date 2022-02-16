import { Router } from "express";
import expressAsyncErrors from "express-async-errors";
/* "If you use a Router, you just have to require it at the beginning 
of each router file" - https://stackoverflow.com/a/59176322/18119360 */

import UserController from "../controller/UserController.js";

const userController = new UserController();

const router = Router();

router.get("/users", userController.index);
router.get("/users/:id", userController.getOne);
router.post("/users", userController.store);
router.put("/users/:id", userController.update);
// router.patch("/users/:id", userController.updateOne);
router.delete("/users/:id", userController.remove);

export default router;