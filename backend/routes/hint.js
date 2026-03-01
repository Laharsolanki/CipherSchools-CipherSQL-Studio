const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
    const { question, currentQuery } = req.body;

    if (!question || !currentQuery) {
        return res.status(400).json({ error: 'Question and currentQuery are required for a hint' });
    }
    
    // If no real API key is provided, return a mock hint so the app doesn't crash
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_API_KEY') {
        return res.json({ 
            hint: "This is a mock hint because no Gemini API key was provided. Check if you missed a SELECT or WHERE clause." 
        });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const prompt = `
    You are an expert SQL tutor for a platform called CipherSQL Studio. 
    A student is working on the following assignment question:
    ---
    ${question}
    ---
    
    Their current SQL query attempt is:
    ---
    ${currentQuery}
    ---
    
    Provide a brief, encouraging hint to help them get closer to the solution. 
    Point out syntax errors, conceptual misunderstandings, or logical missteps.
    CRITICAL REQUIREMENT: DO NOT give them the final, fully corrected SQL query under any circumstances. 
    Guide them, do not solve it for them.
  `;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ hint: text });
    } catch (err) {
        console.error('LLM Hint generation error:', err);
        res.status(500).json({ error: 'Could not generate hint at this time.', details: err.message });
    }
});

module.exports = router;
