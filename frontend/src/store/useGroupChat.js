import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

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
        const {selectedGroup, messages} = get();
        try{
            const res = await axiosInstance.post(`/groups/${selectedGroup._id}/messages`, messageData);
            set({messages: [...messages, res.data]});
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