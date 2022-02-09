import { Router } from "express";

import ShortenerController from "../controller/ShortenerController.js";

const shortenerController = new ShortenerController();

const router = Router();

router.get("/shortener", shortenerController.index);
router.get("/shortener/:id", shortenerController.getOne);
router.post("/shortener", shortenerController.store);
router.put("/shortener/:id", shortenerController.update);
router.delete("/shortener/:id", shortenerController.remove);

export default router;