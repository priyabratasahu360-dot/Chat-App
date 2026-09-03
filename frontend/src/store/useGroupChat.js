import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useGroupChat = create((set, get) => ({
    groupUsers: [],
    groups: [],
    messages: [],
    selectedGroup: null,
    isGroupsLoading: false,
    isUserLoading: false,
    isMessageLoading: false,

    getUsers: async() => {
        const {selectedGroup} = get();
        try{
            const res = await axiosInstance.get(`/groups/${selectedGroup._id}/members`);
            set({groupUsers: res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }
    },

    createGroup: async(groupData) => {
        set({isGroupsLoading: true});
        try{
            const res = await axiosInstance.post("/groups", groupData);

            const groupObj = res.data;

            const structuredGroup = {
            _id: `temp-${Date.now()}`, // unique tracking ID
            role: "admin",
            groupId: groupObj       // group metadata
        };

            const currentGroups = get().groups;
            const groupList = Array.isArray(currentGroups) ? currentGroups : [];
            set({groups: [...groupList, structuredGroup]});
            toast.success("Group created");
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isGroupsLoading: false});
        }
    },

    getGroups: async() => {
        set({isGroupsLoading: true})
        try{
            const res = await axiosInstance.get("/groups");
            set({groups: res.data});
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isGroupsLoading: false});
        }
    },

    sendGroupMessages: async(messageData) => {
        const {selectedGroup} = get();
        try{
            await axiosInstance.post(`/groups/${selectedGroup._id}/messages`, messageData);
        }
        catch(error){
            console.log("Error in sendGroupMessage: ", error);
            toast.error(error.response?.data?.message);
        }
    },

    getGroupMessages: async () => {
    const { selectedGroup } = get();

    if (!selectedGroup) return;

    set({ isMessageLoading: true });

    try {
        const res = await axiosInstance.get(
            `/groups/${selectedGroup._id}/messages`
        );

        set({ messages: res.data});
    }
    catch (error) {
        toast.error(error.response?.data?.message || "Failed to load messages");
    }
    finally {
        set({ isMessageLoading: false });
    }
    },

    addGroupMember: async(memberIds) => {
        try{
        const {selectedGroup} = get();
            const res = await axiosInstance.post(`/groups/${selectedGroup._id}/members`, {addUserIds: memberIds});
            set({groupUsers: [...get().groupUsers, res.data]})
        }
        catch(error){
            toast.error(error.response?.data?.message)
        }
    },

    removeGroupMember: async(deleteUserId) => {
        try{
            const {selectedGroup} = get();
            if(!selectedGroup) return;

            await axiosInstance.delete(`/groups/${selectedGroup._id}/members/${deleteUserId}`);   
            toast.success("Member removed");
        }
        catch(error){
            toast.error(error.response?.data?.message || "Failed to remove member");
        }
    },

    subscribeToGroupChat: () => {
        try{
            const {selectedGroup} = get();
            if(!selectedGroup) return;

            const socket = useAuthStore.getState().socket;
            
            //join group room
            socket.emit("join_group", selectedGroup._id);

            //listen for new messages
            socket.on("receive_group_message", (newMessage) => {
                // console.log("New group message: ", newMessage);

                set({messages: [...get().messages, newMessage]});
            });
        }
        catch(error){
            toast.error(error.response?.data?.message);
        }
    },

    unsubscribeFromGroupChat: () => {
        const {selectedGroup} = get();
            const socket = useAuthStore.getState().socket;
            if(selectedGroup){
                socket.emit("leave_group", selectedGroup._id);
            }
            socket.off("receive_group_message");
        },
    setSelectedGroup: (selectedGroup) => {
        //selectedGroup format
        {/*
            _id:""
            name: "",
            desc: ""
        */}
        set({selectedGroup})
    }
}))