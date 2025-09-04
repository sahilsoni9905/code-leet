const SUBMISSION_SERVICE_URL = 'http://13.203.186.121:3003';

export default async function handler(req, res) {
  const { path } = req.query;
  const pathString = Array.isArray(path) ? path.join('/') : path || '';
  
  const targetUrl = `${SUBMISSION_SERVICE_URL}/api/submissions/${pathString}`;
  
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
      },
      ...(req.method !== 'GET' && req.method !== 'HEAD' && { body: JSON.stringify(req.body) }),
    });

    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Proxy server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
