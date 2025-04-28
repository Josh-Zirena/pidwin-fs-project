import User from "../../models/user.js";
import { Request, Response } from "express";

export const getTopWinStreaks = async (req: Request, res: Response) => {
  try {
    const leaders = await User.find({}, "name winStreak")
      .sort({ winStreak: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({ leaders });
  } catch (error) {
    console.error("Error fetching top streaks:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
