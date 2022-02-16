import { Router } from "express";
import expressAsyncErrors from "express-async-errors";
/* "If you use a Router, you just have to require it at the beginning 
of each router file" - https://stackoverflow.com/a/59176322/18119360 */

import ShortenerController from "../controller/ShortenerController.js";

const shortenerController = new ShortenerController();

const router = Router();

router.get("/:hash", shortenerController.redirect);
router.get("/api/shortener", shortenerController.index);
router.get("/api/shortener/:id", shortenerController.getOne);
router.post("/api/shortener", shortenerController.store);
router.put("/api/shortener/:id", shortenerController.update);
router.delete("/api/shortener/:id", shortenerController.remove);

export default router;