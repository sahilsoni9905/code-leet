export default function handler(req, res) {
    console.log(`[TEST API] ${req.method} request received`);

    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    res.status(200).json({
        success: true,
        message: 'API route is working!',
        method: req.method,
        timestamp: new Date().toISOString()
    });
}