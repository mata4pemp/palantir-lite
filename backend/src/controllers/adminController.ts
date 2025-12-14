import { Request, Response } from "express";
import User from "../models/User";
import Chat from "../models/Chat";

// Get all users with their chat count
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Get all users (excluding passwords)
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    // Get chat counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const chatCount = await Chat.countDocuments({ userId: user._id });

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          chatCount: chatCount,
        };
      })
    );

    return res.json({
      users: usersWithStats,
      totalUsers: usersWithStats.length,
    });
  } catch (error) {
    console.error("Get all users error", error);
    return res.status(500).json({
      error: "Failed to fetch users",
    });
  }
};

// Get all chats from all users (admin view)
export const getAllChats = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find({})
      .populate("userId", "name email")
      .sort({ updatedAt: -1 });

    return res.json({
      chats,
      totalChats: chats.length,
    });
  } catch (error) {
    console.error("Get all chats error", error);
    return res.status(500).json({
      error: "Failed to fetch chats",
    });
  }
};

// Get system statistics
export const getSystemStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalRegularUsers = await User.countDocuments({ role: "user" });
    const totalChats = await Chat.countDocuments({});

    return res.json({
      totalUsers,
      totalAdmins,
      totalRegularUsers,
      totalChats,
    });
  } catch (error) {
    console.error("Get system stats error", error);
    return res.status(500).json({
      error: "Failed to fetch statistics",
    });
  }
};
