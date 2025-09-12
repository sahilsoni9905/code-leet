export default async function handler(req, res) {
  const { path } = req.query;
  
  // Construct the backend URL
  const backendPath = Array.isArray(path) ? path.join('/') : (path || '');
  const backendUrl = `https://13.201.255.178/api/auth/${backendPath}`;
  
  console.log(`Proxying ${req.method} request to: ${backendUrl}`);
  
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
      headers: headers,
      // Disable SSL verification for self-signed certificates
      agent: false,
      rejectUnauthorized: false
    };
    
    // Add body for POST, PUT, PATCH requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      requestOptions.body = JSON.stringify(req.body);
    }
    
    // Make request to backend
    const response = await fetch(backendUrl, requestOptions);
    
    // Get response data
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Forward response
    res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Backend connection failed',
      details: error.message 
    });
  }
}