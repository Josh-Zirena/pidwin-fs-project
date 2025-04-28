import { Router } from "express";
import userRouter from "./user/userRouter.js";
import wagerRouter from "./wager/wagerRouter.js";

const router = Router();

router.use("/user", userRouter);
router.use("/wager", wagerRouter);

export default router;
