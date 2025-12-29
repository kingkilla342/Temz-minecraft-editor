export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    const { message, model } = req.body;
    
    try {
        let aiResponse = '';

        if (model === 'gpt35') {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a Minecraft plugin developer assistant.' },
                        { role: 'user', content: message }
                    ],
                    max_tokens: 1500
                })
            });
            const data = await response.json();
            aiResponse = data.choices[0].message.content;
        }

        else if (model === 'gemini') {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: message }] }]
                    })
                }
            );
            const data = await response.json();
            aiResponse = data.candidates[0].content.parts[0].text;
        }

        res.status(200).json({ response: aiResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
