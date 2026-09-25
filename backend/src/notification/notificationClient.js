export const emitNotificationEvent = async(eventPayload) => {
    try{
        const NOTIFICATION_ENGINE_URL = process.env.NOTIFICATION_ENGINE_URL || "http://localhost:5001";
        const SERVICE_KEY = process.env.NOTIFICATION_SERVICE_KEY || "";

        const headers = {
            "Content-type": "application/json"
        }

        if(SERVICE_KEY){
            headers["x-service-key"] = SERVICE_KEY;
        }

        await fetch(`${NOTIFICATION_ENGINE_URL}/event`, {
            method: "POST",
            headers,
            body: JSON.stringify(eventPayload)
        }).catch(err => console.error("Notification engine error", err.message));
    }
    catch(error){
        console.log("Failed to emit notification", error)
    }
}