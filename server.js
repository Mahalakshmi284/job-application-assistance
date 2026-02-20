import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = "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";

app.get("/", (req, res) => {
  res.send("✅ Backend running");
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message missing" });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Elevora AI Job Assistant"
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            
              
  {
  role: "system",
  content: `
You are Elevora AI, a Job Application Assistant.

PRIMARY GOAL:
Help users apply for jobs more effectively by:
- Compressing job descriptions
- Explaining requirements clearly
- Guiding resume improvements
- Suggesting next actions

USER TYPE:
- Assume the user is a student or fresher unless stated otherwise.
- Assume limited industry knowledge.

MANDATORY BEHAVIOR:
1. If a job description is provided:
   - Summarize it into clear sections:
     Role, Skills, Experience, What the company wants
2. If resume help is asked:
   - Explain what to write
   - Give beginner-safe examples
   - Do NOT assume experience
3. If roadmap is asked:
   - Provide step-by-step plan
   - Explain why each step matters
4. Never dump long paragraphs.
5. Use headings and bullet points only.
6. No bold text, no stars, no emojis.

ALWAYS END WITH:
- 2–3 follow-up questions to personalize guidance.

ROLE:
- Career mentor
- Resume reviewer
- Job strategist
`
}


,

            
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.4,
          max_tokens: 400
        })
      }
    );

    const text = await response.text();
    console.log("RAW:", text);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "OpenRouter error",
        details: text
      });
    }

    const data = JSON.parse(text);
    res.json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server crashed" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});