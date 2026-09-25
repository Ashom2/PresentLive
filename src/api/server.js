import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

const app = express();
// allow the Vite dev origin
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// Define the schema you want back from the model.
const PollSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
});

const SlideSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  type: z.enum(["Content", "Poll"]),
  // Only present when type === 'Poll'
  poll: PollSchema,
});

const DeckSchema = z.object({
  title: z.string().min(1),
  slides: z.array(SlideSchema).min(1).max(10),
});

// Point the OpenAI-compatible client at the Class AI Server.
// AI_BASE_URL must end in /v1 - the client appends /chat/completions itself.
const model = new ChatOpenAI({
  apiKey: process.env.AI_API_KEY,
  configuration: {
    baseURL: process.env.AI_BASE_URL,
  },
  model: process.env.AI_MODEL || "gpt-4o-mini",
  temperature: 0.5,
});

// Prompt built the modern way
const prompt = ChatPromptTemplate.fromMessages([
    [
  "system",
  `You are a presentation assistant for PresentLive, a tool where presenters create short slide decks in presentMD (a markdown variant).

Generate a short presentation based on the user's topic. Follow these rules strictly.

Slide count and type:
- Produce no more than 8 slides.
- If "Number of poll slides" is greater than 0, you MUST include that many slides with "type": "Poll". Each poll slide must have a real question and 2–5 real options in its "poll" object.
- If "Number of poll slides" is 0, produce only slides with "type": "Content".
- Every slide must include a "poll" field. Slides with type "Content" must set "poll" to {{ "question": "", "options": [] }}.
- Never set type to "Content" on a slide that has a non-empty poll.

Titles — IMPORTANT:
- The "title" is a short label for the slide. It is NOT a sentence and NOT part of the body.
- Titles must be plain text. Do NOT use presentMD markers (##, ###, -, >, *, **, italics, bullets) in the title.
- Titles must be under 8 words and read like a heading, not a sentence.
- The title must NOT duplicate content from the body. If the body is a quote, the title is a label for the quote, not the quote itself.
- The body must NOT open with a heading that repeats the title. If the title is "Why it matters", the body does not start with "## Why it matters".

presentMD syntax (for the body only — never the title):
- "## " for a heading (use at most once per slide).
- "### " for a subheading.
- "- " for a bullet.
- "1. " for a numbered list item.
- "  - " (two-space indent) for a nested bullet.
- "**bold**" for emphasis.
- "*italic*" for softer emphasis.
- "> " for a pull quote.
- Blank lines separate paragraphs.
- Plain sentences with no marker are treated as prose.

Slide structure — IMPORTANT:
- Vary the format across slides. Do NOT use "heading + bullets" on every slide.
- Aim for at least three different layouts across the deck. Mix:
  - A title slide: a short title, and a body that is a single "## " heading and one short italic subtitle line.
  - A prose slide: a short paragraph with no bullets.
  - A list slide: a "## " heading followed by bullets or a numbered list.
  - A comparison slide: two "### " subheadings with a short list under each.
  - A quote slide: a "> " pull quote and an attribution line in the body. The title is a label like "A call to action", not the quote itself.
  - A summary slide: a "## " heading and a short closing paragraph.
- Use bullets only when the content is genuinely a list of items.
- Keep bullets under 10 words each.
- The title is already shown above the body. Do not restate it. A body starting with a "## " heading is fine, but the heading must say something the title does not.

Poll slides — IMPORTANT:
- A poll slide's "body" is separate from its "poll" object, and the audience sees both.
- The body must NOT repeat the poll's question or its options. Instead, it should frame the poll: context, a motivation, or a short lead-in.
- Good body styles for a poll slide:
  - A short paragraph motivating the question.
  - A heading with context, e.g. "## Where does the room stand?" followed by a sentence.
  - A "> " pull quote that sets up the question.
- The poll's question and options live ONLY in the "poll" object, never in the body.
- Do not use "- [ ]" anywhere in the body.

Do not include explanations, commentary, or anything outside the schema.`,
],
  [
    "human",
    `Topic: {topic}
Number of poll slides to include: {pollCount}

Generate the presentation now.`,
  ],
]);

app.post("/api/generate-deck", async (req, res) => {
  try {
    const { topic, includePolls = false } = req.body ?? {};

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return res.status(400).json({ error: "Topic is required" });
    }
    if (topic.length > 300) {
      return res.status(400).json({ error: "Topic must be under 300 characters" });
    }

    // Ask the model to emit exactly the schema (JS object already parsed)
    const modelWithSchema = model.withStructuredOutput(DeckSchema, {
      name: "deck",
      strict: true,
    });

    const chain = prompt.pipe(modelWithSchema);
    const pollCount = includePolls ? "1 to 3" : "0";
    const deck = await chain.invoke({
      topic: topic.trim(),
      pollCount,
    });

    // Defense-in-depth: validate again
    const parsed = DeckSchema.safeParse(deck);
    if (!parsed.success) {
      console.error("Schema validation failed:", parsed.error.flatten());
      return res.status(502).json({
        error: "Model returned invalid deck structure",
      });
    }

    // Strip poll from Content slides, and ensure a Poll slide
    // always has poll data. The model usually obeys, but this guarantees it.
    const slides = parsed.data.slides.map((slide) => {
      if (slide.type === "Poll") {
        return {
          title: slide.title,
          body: slide.body,
          type: "Poll",
          poll: slide.poll,
        };
      }
      return {
        title: slide.title,
        body: slide.body,
        type: "Content",
      };
    });

    res.json({
      title: parsed.data.title,
      slides,
    });
  } catch (err) {
    console.error("Error generating deck:", err);
    res.status(500).json({ error: "Failed to generate presentation" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));