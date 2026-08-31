import GroupMember from "../models/GroupMember.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.id;

    const member = await GroupMember.findOne({ groupId, userId });

    if (!member || member.role !== "admin") {
      return res.status(403).json({ message: "Access Denied, Admins Only" });
    }
    next();
  } catch (error) {
    console.log("Error in isAdmin midddleware: ", error.message);
  }
};
