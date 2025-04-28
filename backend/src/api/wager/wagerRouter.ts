import { Router } from "express";
import { play } from "../../controllers/wager/wager-play.js";
import auth from "../../utils/auth.js";

const router = Router();
router.post("/", auth, play);

export default router;
