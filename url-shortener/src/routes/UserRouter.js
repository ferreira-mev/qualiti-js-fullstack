import { Router } from "express";
import expressAsyncErrors from "express-async-errors";
/* "If you use a Router, you just have to require it at the beginning 
of each router file" - https://stackoverflow.com/a/59176322/18119360 */

import UserController from "../controller/UserController.js";

const userController = new UserController();

const router = Router();

router.get("/users", userController.index.bind(userController));
router.get("/users/:id", userController.getOne.bind(userController));
router.post("/users", userController.store.bind(userController));
router.put("/users/:id", userController.update.bind(userController));
// router.patch("/users/:id", userController.updateOne.bind(userController));
router.delete("/users/:id", userController.remove.bind(userController));
router.post("/login", userController.login.bind(userController));

export default router;