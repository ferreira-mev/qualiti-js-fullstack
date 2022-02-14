import { Router } from "express";

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