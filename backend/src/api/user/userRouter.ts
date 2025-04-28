import { Router } from "express";
import login from "../../controllers/user/user-login.js";
import signup from "../../controllers/user/user-signup.js";
import changePassword from "../../controllers/user/user-change-password.js";
import auth from "../../utils/auth.js";
import { getTopWinStreaks } from "../../controllers/user/user-top-win-streaks.js";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/changePassword", auth, changePassword);
router.get("/leaders", getTopWinStreaks);

export default router;
