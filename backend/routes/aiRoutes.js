const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

// Simple in-memory rate limiting map for AI requests (IP -> last timestamp)
// Supplementary Requirement: Prevents excessive API calls & abuse
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 3000; // 3 seconds cooldown per client

/**
 * Heuristic fallback generator when AI API key is invalid, missing, or times out
 * Guarantees graceful degradation without crashing the application.
 */
function generateContextualFallback(title) {
  const cleanTitle = (title || "").trim();
  const lower = cleanTitle.toLowerCase();

  let action = "Complete the necessary implementation steps, perform code review, and verify against acceptance criteria.";
  let suggestedPriority = "Medium";

  if (lower.includes("bug") || lower.includes("fix") || lower.includes("error") || lower.includes("crash") || lower.includes("fail")) {
    action = "Investigate the root cause of the defect, replicate in a local test environment, apply the bugfix, and verify regression tests.";
    suggestedPriority = "High";
  } else if (lower.includes("auth") || lower.includes("security") || lower.includes("jwt") || lower.includes("login") || lower.includes("token")) {
    action = "Implement end-to-end authentication flow, ensure bcrypt hashing and JWT token verification, and add route protection middlewares.";
    suggestedPriority = "High";
  } else if (lower.includes("test") || lower.includes("ci") || lower.includes("pipeline") || lower.includes("action")) {
    action = "Write automated unit and integration tests using Jest & Supertest, verify CI pipeline triggers on push, and ensure all tests pass.";
    suggestedPriority = "Medium";
  } else if (lower.includes("doc") || lower.includes("readme") || lower.includes("clean") || lower.includes("style")) {
    action = "Review documentation clarity, update README screenshots and architecture diagrams, and ensure clean formatting.";
    suggestedPriority = "Low";
  } else if (lower.includes("cache") || lower.includes("perf") || lower.includes("speed") || lower.includes("optimize")) {
    action = "Implement in-memory caching using node-cache, configure TTL and invalidation on writes, and measure response times.";
    suggestedPriority = "High";
  }

  return {
    description: `Auto-generated task plan for "${cleanTitle}":\n• Objective: ${cleanTitle}\n• Action Items: ${action}\n• Acceptance Criteria: Verified in local development and production environments.`,
    priority: suggestedPriority,
  };
}

// =========================================================================
// POST /api/ai/generate-description
// Accepts: { title: string }
// Returns: { success: boolean, description: string, priority: string, source: string, fallback: boolean }
// =========================================================================
router.post("/generate-description", async (req, res) => {
  const { title } = req.body;

  // 1. Input Validation
  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Task title is required to generate an AI description",
    });
  }

  // 2. Simple Rate Limiting (Supplementary Problem)
  const clientKey = req.ip || req.headers["x-forwarded-for"] || "default-client";
  const now = Date.now();
  const lastRequest = rateLimitMap.get(clientKey);

  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW_MS) {
    const waitSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - lastRequest)) / 1000);
    return res.status(429).json({
      success: false,
      message: `Rate limit reached. Please wait ${waitSeconds}s before requesting another AI description.`,
    });
  }
  rateLimitMap.set(clientKey, now);

  const cleanTitle = title.trim();

  // 3. Try OpenAI API if OPENAI_API_KEY is configured
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== "") {
    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        timeout: 8000, // 8 second timeout
      });

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful project manager assistant. Generate a concise, actionable task description (2-4 sentences or bullet points) and suggest a priority (Low, Medium, High) for a software engineering task.",
          },
          {
            role: "user",
            content: `Write a task description and suggest priority for this task title: "${cleanTitle}"`,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      const responseText = completion.choices[0]?.message?.content || "";
      const lowerResp = responseText.toLowerCase();
      let suggestedPriority = "Medium";
      if (lowerResp.includes("priority: high") || lowerResp.includes("high priority")) suggestedPriority = "High";
      else if (lowerResp.includes("priority: low") || lowerResp.includes("low priority")) suggestedPriority = "Low";

      return res.status(200).json({
        success: true,
        description: responseText.trim(),
        priority: suggestedPriority,
        source: "OpenAI gpt-4o-mini",
        fallback: false,
        disclaimer: "AI-generated suggestion. Please review before saving.",
      });
    } catch (openaiError) {
      console.warn("⚠️ OpenAI API Call Failed:", openaiError.message);
      // Fall through to Gemini or Graceful Degradation
    }
  }

  // 4. Try Google Gemini API if GEMINI_API_KEY is configured
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "") {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Write a short, professional task description (2-3 bullet points) for: "${cleanTitle}".`,
                },
              ],
            },
          ],
        }),
      });

      if (geminiResponse.ok) {
        const geminiData = await geminiResponse.json();
        const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) {
          return res.status(200).json({
            success: true,
            description: generatedText.trim(),
            priority: cleanTitle.toLowerCase().includes("bug") ? "High" : "Medium",
            source: "Google Gemini 1.5 Flash",
            fallback: false,
            disclaimer: "AI-generated suggestion. Please review before saving.",
          });
        }
      }
    } catch (geminiError) {
      console.warn("⚠️ Gemini API Call Failed:", geminiError.message);
      // Fall through to Graceful Degradation
    }
  }

  // 5. Graceful Degradation (Fallback Path)
  // Ensures core app continues working normally even if third-party AI fails or is offline
  const fallbackData = generateContextualFallback(cleanTitle);

  return res.status(200).json({
    success: true,
    description: fallbackData.description,
    priority: fallbackData.priority,
    source: "Contextual AI Fallback Engine",
    fallback: true,
    message: "External AI API offline or unconfigured. Intelligent fallback template provided.",
    disclaimer: "AI-generated suggestion. Please review before saving.",
  });
});

// Alias for convenience: POST /api/ai/suggest
router.post("/suggest", (req, res) => {
  req.url = "/generate-description";
  router.handle(req, res);
});

// GET /api/ai/status — Health check & config status
router.get("/status", (req, res) => {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim() !== "");
  const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");

  res.status(200).json({
    success: true,
    feature: "Practical 13: AI API Integration",
    configured: hasOpenAI || hasGemini,
    activeProvider: hasOpenAI ? "OpenAI gpt-4o-mini" : hasGemini ? "Google Gemini" : "Graceful Fallback Mode",
    rateLimitSeconds: RATE_LIMIT_WINDOW_MS / 1000,
  });
});

module.exports = router;
