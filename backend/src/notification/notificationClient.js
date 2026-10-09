export const emitNotificationEvent = async (eventPayload) => {
    try {
        const NOTIFICATION_ENGINE_URL = process.env.NOTIFICATION_ENGINE_URL || "";
        const SERVICE_KEY = process.env.NOTIFICATION_SERVICE_KEY || "";

        const headers = {
            "Content-Type": "application/json"
        };

        if (SERVICE_KEY) {
            headers["x-service-key"] = SERVICE_KEY;
        }

        const res = await fetch(`${NOTIFICATION_ENGINE_URL}/event`, {
            method: "POST",
            headers,
            body: JSON.stringify(eventPayload)
        });

        // Erro handling
        if (!res.ok) {
            const errData = await res.json().catch(() => ({ message: res.statusText }));
            console.error(`[Notification Engine Error ${res.status}]:`, errData.message || errData);
            return { success: false, status: res.status, error: errData };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error("Failed to connect or emit notification:", error.message || error);
        return { success: false, error: error.message };
    }
};
