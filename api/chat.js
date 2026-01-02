export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    const { message } = req.body;
    
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CLAUDE_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                messages: [{
                    role: 'user',
                    content: `You are a Minecraft plugin developer assistant. Help create plugins, addons, and datapacks with clear code and explanations.\n\nUser request: ${message}`
                }]
            })
        });
        
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        
        const aiResponse = data.content[0].text;
        res.status(200).json({ response: aiResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
