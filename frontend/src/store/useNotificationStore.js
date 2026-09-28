import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const NOTIFICATION_ENGINE_URL = "http://localhost:5001";
const NOTIFICATION_WS_URL = "ws://localhost:5001";

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
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