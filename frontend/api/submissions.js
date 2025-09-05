const SUBMISSION_SERVICE_URL = 'http://13.203.186.121:3003';

export default async function handler(req, res) {
    try {
        // Extract the path from the request URL
        const url = new URL(req.url, `http://${req.headers.host}`);
        const path = url.pathname.replace('/api/submissions', '') || '/';

        const targetUrl = `${SUBMISSION_SERVICE_URL}/api/submissions${path}`;

        console.log('Submissions Proxy - Target URL:', targetUrl);
        console.log('Submissions Proxy - Method:', req.method);

        // Prepare request options
        const requestOptions = {
            method: req.method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Vercel-Serverless-Function',
                ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
            },
        };

        // Handle request body for POST/PUT requests
        if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
            requestOptions.body = JSON.stringify(req.body);
        }

        // Make the request to the backend
        const response = await fetch(targetUrl, requestOptions);

        // Get response as text first
        const responseText = await response.text();

        // Try to parse as JSON
        let responseData;
        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            console.log('Response is not JSON, returning as text');
            responseData = { message: responseText };
        }

        // Return the response
        res.status(response.status).json({
            success: response.ok,
            data: responseData,
            status: response.status
        });

    } catch (error) {
        console.error('Submissions Proxy Error:', error);
        res.status(500).json({
            success: false,
            message: 'Submissions proxy server error',
            error: error.message
        });
    }
}
