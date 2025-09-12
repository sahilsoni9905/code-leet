// Disable Node.js SSL verification for self-signed certificates
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

export default async function handler(req, res) {
    // Handle CORS for preflight requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // This handles /api/problems (root endpoint)
    const backendUrl = 'https://13.201.255.178/api/problems';

    console.log(`[PROBLEMS ROOT] ${req.method} ${backendUrl}`);
    console.log(`[PROBLEMS ROOT] Request body:`, req.body);

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

        // Add body for POST, PUT requests
        if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
            requestOptions.body = JSON.stringify(req.body);
        }

        console.log(`[PROBLEMS ROOT] Sending to backend:`, requestOptions);

        // Make request to backend
        const response = await fetch(backendUrl, requestOptions);

        console.log(`[PROBLEMS ROOT] Backend responded with status:`, response.status);

        // Get response text first to handle any response format
        const responseText = await response.text();
        console.log(`[PROBLEMS ROOT] Backend response:`, responseText);

        // Try to parse as JSON, fallback to sending as-is
        let data;
        try {
            data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
            console.log(`[PROBLEMS ROOT] Failed to parse JSON, sending as text`);
            data = { message: responseText || 'Empty response' };
        }

        // Forward response with proper status
        return res.status(response.status).json(data);

    } catch (error) {
        console.error(`[PROBLEMS ROOT] Error:`, error);
        return res.status(500).json({
            error: 'Backend connection failed',
            details: error.message,
            url: backendUrl
        });
    }
}