export async function sendTelemetry({ backendUrl, payload }) {
    const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
        const error = new Error("Backend rejected telemetry payload");
        error.status = response.status;
        error.responseBody = responseBody;
        throw error;
    }

    return responseBody;
}
