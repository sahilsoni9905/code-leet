const AUTH_SERVICE_URL = 'http://13.201.255.178:3001';

export default async function handler(req, res) {
  try {
    // Extract the path from the request URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname.replace('/api/auth', '') || '/';

    const targetUrl = `${AUTH_SERVICE_URL}/api/auth${path}`;

    console.log('Auth Proxy - Target URL:', targetUrl);
    console.log('Auth Proxy - Method:', req.method);

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
    console.error('Auth Proxy Error:', error);
    res.status(500).json({
      success: false,
      message: 'Auth proxy server error',
      error: error.message
    });
  }
}
