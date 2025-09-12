// Disable Node.js SSL verification for self-signed certificates
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

export default async function handler(req, res) {
    const { userId } = req.query;

    // Handle CORS for preflight requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // This handles /api/submissions/user/[userId]
    const backendUrl = `https://13.201.255.178/api/submissions/user/${userId}`;

    console.log(`[SUBMISSIONS USER] ${req.method} ${backendUrl}`);

    try {
        // Prepare headers
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        // Forward authorization header if present
        if (req.headers.authorization) {
            headers.Authorization = req.headers.authorization;
        }

        // Prepare request options
        const requestOptions = {
            method: req.method,
            headers: headers
        };

        console.log(`[SUBMISSIONS USER] Sending to backend:`, requestOptions);

        // Make request to backend
        const response = await fetch(backendUrl, requestOptions);

        console.log(`[SUBMISSIONS USER] Backend responded with status:`, response.status);

        // Get response text first to handle any response format
        const responseText = await response.text();
        console.log(`[SUBMISSIONS USER] Backend response:`, responseText);

        // Try to parse as JSON, fallback to sending as-is
        let data;
        try {
            data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
            console.log(`[SUBMISSIONS USER] Failed to parse JSON, sending as text`);
            data = { message: responseText || 'Empty response' };
        }

        // Forward response with proper status
        return res.status(response.status).json(data);

    } catch (error) {
        console.error(`[SUBMISSIONS USER] Error:`, error);
        return res.status(500).json({
            error: 'Backend connection failed',
            details: error.message,
            url: backendUrl
        });
    }
}