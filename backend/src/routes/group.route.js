import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

import { createGroup,
         allGroup,
         gropuDetail,
         updateGroup,
         groupMembers,
         addNewUser,
         removeUser,
         chatHistory,
         sendGroupChats
         } from "../controllers/group.controller.js";

const router = express.Router();

router.use(protectRoute);

//standard routes
router.post("/", createGroup); //create a new group
router.get("/", allGroup); //get all group belongs to logged in user
router.get("/:groupId", gropuDetail); // get details about group
router.put("/:groupId",isAdmin, updateGroup); // update group info like name or profile

//member management routes
router.get("/:groupId/members", groupMembers) //get all members of the group
router.post("/:groupId/members", isAdmin, addNewUser);//add new user to group
router.delete("/:groupId/members/:userId", isAdmin, removeUser);// delete a user from group

//messaging routes
router.get("/:groupId/messages", chatHistory)// load all past chats
router.post("/:groupId/messages", sendGroupChats)// send messages to group

export default router;
