import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const NOTIFICATION_ENGINE_URL = "https://notification-engine-jts1.onrender.com";
const NOTIFICATION_WS_URL = "wss://notification-engine-jts1.onrender.com";

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    preferences: {
        notificationsEnabled: true,
        inApp: true,
        email: false,
        push: false
    },
    isNotificationsLoading: false,
    ws: null,

    // fetch unread notifications
    getNotifications: async(userId) => {
        set({isNotificationsLoading: true})
        try{
            const res = await axios.get(`${NOTIFICATION_ENGINE_URL}/api/notifications/?userId=${userId}&read=false`);
            set({
                notifications: res.data.notifications || [],
                unreadCount: res.data.unreadCount || 0
            });
        }
        catch(error){
            console.log("Error fetching notifications: ", error);
            const msg = error.response?.data?.message || "Failed to load message";
            toast.error(msg);
        }
        finally{
            set({isNotificationsLoading: false});
        }
    },

    //ws connection to notification engine
    connectNotificationSocket: async(userId) => {
        if(!userId) return;
        //if connection already exist
        const existingWs = get().ws;
        if(existingWs && existingWs.readyState === WebSocket.OPEN) return;

        const ws = new WebSocket(`${NOTIFICATION_WS_URL}?userId=${userId}`);

        ws.onmessage = (event) => {
            try{
                const message = JSON.parse(event.data);
                if(message.event === "notification.received"){
                    const newNotif = message.data;

                    //add new notification to top of list
                    set((state) => ({
                        notifications: [newNotif, ...state.notifications],
                        unreadCount: state.unreadCount + 1
                    }))

                    //toast message
                    toast.success(`${newNotif.title}: ${newNotif.message}`)
                }
            }
            catch(error){
                console.error("Error parsing ws notifications", error);
            }
        }

        ws.onerror = (err) => {
            console.error("Ws error:", err);
        }

        ws.onclose = () => {
            set({ws: null});
        }
    },

    getNotificationPreferences: async(userId) => {
        if(!userId) return;
        try{
            const res = await axios.get(`${NOTIFICATION_ENGINE_URL}/api/preferences/${userId}`);
            if(res.data){
                set({preferences: {
                    notificationsEnabled: res.data.notificationsEnabled ?? true,
                    inApp: res.data.channels?.inApp ?? true,
                    email: res.data.channels?.inApp ?? false,
                    push: res.data.channels?.inApp ?? false,
                }});
            }
        }
        catch(error){
            console.error("Failed to fetch preferences: ", error);
        }
    },

    setNotificationPreferences: async(userId, channel) => {
        if(!userId) return;
        const currentPreferences = get().preferences;
        const updatedPreferences ={
            ...currentPreferences, [channel]: !currentPreferences[channel]
        }

        set({preferences: updatedPreferences});

        const payload = {
            userId,
            notificationsEnabled: updatedPreferences.notificationsEnabled,
            channels: {
                inApp: updatedPreferences.inApp,
                email: updatedPreferences.email,
                push: updatedPreferences.push
            },
            mutedSources: [],
            mutedTypes: []
        }
        try{
            await axios.put(`${NOTIFICATION_ENGINE_URL}/api/preferences/${userId}`, payload);
        }
        catch(error){
            console.error("Failed to set preferences: ", error);
            toast.error("Something went wrong");
            set({preferences: currentPreferences})
        }
    },

    //disconnect on logout
    disconnectNotificationSocket: () => {
        const ws = get().ws;

        if(ws){
            ws.close();
            set({ws: null});
        }

    },

    markAsRead: async(notificationId) => {
        try{
            await axios.patch(`${NOTIFICATION_ENGINE_URL}/api/notifications/${notificationId}/read`);
            set((state) => ({
                notifications: state.notifications.filter((n) => (n.id || n._id) !== notificationId),
                unreadCount: Math.max(0, state.unreadCount - 1)
            }))
        }
        catch(error){
            console.error("Failed to mark notification as read", error);
        }
    },

    markAsAllRead: async(userId) => {
        try{
            await axios.patch(`${NOTIFICATION_ENGINE_URL}/api/notifications/read-all`, {userId});

            set({
                notifications: [],
                unreadCount: 0
            })
        }
        catch(error){
            console.error("Failed to mark all as read: ", error);
        }
    }
}))