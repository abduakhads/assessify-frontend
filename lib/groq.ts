import Groq from "groq-sdk";

// This function should only be called from server-side code (API routes, Server Components, etc.)
// Never call this from Client Components as it requires the API key

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error(
      'GROQ_API_KEY is not set. Please add it to your .env file and restart the dev server.'
    );
  }
  
  return new Groq({ apiKey });
}

export async function generateQuizQuestions(
  text: string,
  numQuestions: number,
  numAnswers: number,
  numCorrectAnswers: number
) {
  const prompt = `Generate multiple choice questions from text provided below with following constraints:
number of questions: ${numQuestions}
number of answers for each question: ${numAnswers}
number of correct answers per each question: ${numCorrectAnswers}

Text:
"${text}"

Return only JSON in following format:
[
    {
        "question": "What is Capital of France?",
        "answers": [
            {
                "text": "Paris",
                "isCorrect": true
            },
            {
                "text": "London",
                "isCorrect": false
            },
            {
                "text": "Berlin",
                "isCorrect": false
            }
        ]
    }
]`;

  const groq = getGroqClient();
  
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "openai/gpt-oss-120b",
  });

  const generatedText = chatCompletion.choices[0]?.message?.content || "";

  // Parse and return the JSON
  try {
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(generatedText);
  } catch (error) {
    console.error('Failed to parse generated text as JSON:', error);
    throw new Error('Failed to generate valid quiz questions JSON');
  }
}

