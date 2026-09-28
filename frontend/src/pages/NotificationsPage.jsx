import { useNotificationStore } from "../store/useNotificationStore";

export const NotificationsPage = () => {
    const { notifications, unreadCount, markAsRead, isNotificationsLoading } = useNotificationStore();
    // console.log(notifications)
    if (isNotificationsLoading) {
        return <div className="p-8">Loading notifications...</div>;
    }

    return (
        <div className="min-h-screen pt-16 bg-[#008080] p-6 text-white">
            <h1 className="text-2xl font-bold mb-4">
                Notifications {unreadCount > 0 && <span className="bg-red-500 text-xs px-2 py-1 rounded-full">{unreadCount}</span>}
            </h1>

            {notifications.length === 0 ? (
                <p>No unread notifications.</p>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notif) => {
                        const id = notif?.id || notif?._id;
                        return (
                            <div 
                                key={id} 
                                onClick={() => markAsRead(id)}
                                className="bg-white/10 p-4 rounded-lg cursor-pointer hover:bg-white/20 transition flex justify-between items-center"
                            >
                                <div>
                                    <span className="text-xs uppercase bg-black/30 px-2 py-0.5 rounded mr-2">
                                        {notif.source}
                                    </span>
                                    <strong className="block mt-1">{notif.title}</strong>
                                    <p className="text-sm opacity-90">{notif.message}</p>
                                </div>
                                <span className="text-xs opacity-75">Click to dismiss</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
