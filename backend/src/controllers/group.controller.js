import Group from "../models/Group.model.js";
import GroupChat from "../models/GroupChat.model.js";
import GroupMember from "../models/GroupMember.model.js";


export const createGroup = async(req, res) => {
    try{

        const creatorId = req.user.id;
        
        //userIds expecting to be an array of strings: ["id1", "id2", ....]
        const {name, description, userIds} = req.body;
        
        const newGroup = await Group.create({name, description});
        
        const groupMembers = [];

        //group creator assigned the role "admin"
        groupMembers.push({
            groupId: newGroup._id,
            userId: creatorId,
            role: "admin"
        });

        if(Array.isArray(userIds) && userIds.length > 0){
            userIds.forEach((userId) => {
                if(userId !== creatorId){ //prevents adding admin twice
                    groupMembers.push({
                        groupId: newGroup._id,
                        userId: creatorId,
                        role: "member"
                    });
                }
            })
        }

        await GroupMember.insertMany(groupMembers);

        res.status(201).json({message: "Group created", group: newGroup});
    }
    catch(error){
        console.log("Error in createGroup: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const allGroup = async(req, res) => {
    try{
        const userId = req.user.id;

        const groups = await GroupMember.find({userId}).populate("groupId");

        res.status(200).json({message: "all groups", group: groups});
    }
    catch(error){
        console.log("Error in allGroup: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const gropuDetail = async(req, res) => {
    try{
        const groupId = req.params.groupId;

        const group = await Group.findById(groupId);

        res.status(200).json({message: "Group details", group: group});
    }
    catch(error){
        console.log("Error in groupDetil: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}
export const updateGroup = async(req, res) => {
    try{
        const groupId = req.params.groupId;
        const {name, description} = req.body;

        const group = await Group.findByIdAndUpdate(groupId, {
            name,
            description
        }, {returnDocument: "after"});

        res.status(200).json({message: "updated group", group: group});
    }
    catch(error){
        console.log("Error in updateGroup: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const groupMembers = async(req, res) => {
    try{
        const groupId = req.params.groupId;
        const userId = req.user.id;

        const isMember = await GroupMember.findOne({groupId, userId});

        if(!isMember){
            return res.status(403).json({message: "You are not a member of this group"});
        }

        const members = await GroupMember.find({groupId}).populate("userId", "fullname email profilePicture");

        res.status(200).json({message: "All group members", members: members});
    }
    catch(error){
        console.log("Error in groupMembers: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const addNewUser = async(req, res) => {
    try{
        const groupId = req.params.groupId;
        const userId = req.user.id; //loggedIn user's id

        const {addedUserId} = req.body;
        
        const isAdmin = await GroupMember.findOne({groupId, userId});
        if(isAdmin.role !== "admin"){
            return res.status(403).json({message: "Only Admins of this group can add members"});
        }

        const existingMember = await GroupMember.findOne({groupId, userId:addedUserId});

        if(existingMember){
            return res.status(409).json({message: "User already added", existingMember});
        }

        const newUser = await GroupMember.create({
            groupId,
            userId: addedUserId,
            role: "member"
        })

        res.status(201).json({message: "A new user added", newUser});
    }
    catch(error){
        console.log("Error in addNewUser: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const removeUser = async(req, res) => {
    try{
        const groupId = req.params.groupId;
        const removedUserId = req.params.userId
        const userId = req.user.id;

        const isAdmin = await GroupMember.findOne({groupId, userId});
        if(isAdmin.role !== "admin"){
            return res.status(403).json({message: "Only Admins of this group can remove members"});
        }

        const removed = await GroupMember.deleteOne({groupId, userId: removedUserId}).populate("userId", "fullname");

        res.status(200).json({message: "User Removed", removed: removed});
    }
    catch(error){
        console.log("Error in removeUser: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const chatHistory = async(req, res) => {
    try{
        const groupId = req.params.groupId;

        const chats = await GroupChat.find({groupId});

        res.status(200).json({message: "chat history", chats: chats});
    }
    catch(error){
        console.log("Error in chatHistory: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export const sendGroupChats = async(req, res) => {
    try{
        const groupId = req.params.groupId;
        const {text} = req.body;
        const senderId = req.user.id;
        
        //save to database
        const newMessage = await GroupChat.create({
            groupId,
            senderId,
            content: text
        });

        //broadcast live to online users
        io.to(groupId).emit("receive_group_message", newMessage);

        res.status(201).json({message: "You sent a new message", chat: newMessage})
    }
    catch(error){
        console.log("Error in sendGroupChats: ", error.message);
        res.status(500).json({message: "Internal server error"});
    }
}