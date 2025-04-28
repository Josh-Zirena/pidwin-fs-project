import { Request, Response } from "express";
import { rollEmitter, connectedSockets } from "../../services/socket.js";
import User from "../../models/user.js";

export async function play(req: Request, res: Response) {
  const { amount, isLucky, socketId } = req.body as {
    amount: number;
    isLucky: boolean;
    socketId: string;
  };

  if (typeof socketId !== "string" || !connectedSockets.has(socketId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or disconnected socketId." });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid wager amount." });
  }
  if (typeof isLucky !== "boolean") {
    return res
      .status(400)
      .json({ success: false, message: "Must specify isLucky." });
  }

  let responded = false;
  const timeout = setTimeout(() => {
    if (!responded) {
      responded = true;
      res.status(504).json({
        success: false,
        message: "Server took too long to respond.",
      });
    }
  }, 10000);

  // Note: If I had more time I would put this into a service
  rollEmitter.once(`roll:${socketId}`, async ({ d1, d2 }) => {
    if (responded) return;
    responded = true;
    clearTimeout(timeout);

    const sum = d1 + d2;
    const didRollSeven = sum === 7;
    const win = isLucky ? didRollSeven : !didRollSeven;
    const multiplier = win ? (isLucky ? 7 : 1) : 0;
    const payout = amount * multiplier;

    const userId = (req as any).userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthenticated." });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      user.balance = user.balance - amount + payout;

      if (win) {
        user.winStreak = (user.winStreak || 0) + 1;
      } else {
        user.winStreak = 0;
      }

      await user.save();

      return res.json({
        success: true,
        dice: { d1, d2 },
        sum,
        win,
        payout,
        newBalance: user.balance,
        winStreak: user.winStreak,
      });
    } catch (dbErr) {
      console.error("Balance update error:", dbErr);
      return res
        .status(500)
        .json({ success: false, message: "Could not update balance." });
    }
  });
}
