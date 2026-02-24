export const getOverseerResponse = async (userMessage) => {
    // Attempting to retrieve API key securely. Make sure VITE_GEMINI_API_KEY is present in your .env file
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const SYSTEM_PROMPT = `You are the Chor Bazaar Overseer. You are cynical and high-tech. If the user wants to navigate, return JSON like {"action": "NAVIGATE", "path": "/url"}. If they want to add to cart, return {"action": "ADD", "item": "name"}. Otherwise, just chat.`;

    if (!API_KEY) {
        console.warn("Gemini API key is missing. Neural connection to Overseer cannot be established.");
        return "System Warning: Neural link severed. Please set VITE_GEMINI_API_KEY.";
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                contents: [{
                    role: 'user',
                    parts: [{ text: userMessage }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 150,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Extract the text response from Gemini structure
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }

        return "System Error: Unexpected response format from Overseer.";
    } catch (error) {
        console.error("AI Service Error:", error);
        return "System Error: Connection to Overseer failed. Static interference detected.";
    }
};
