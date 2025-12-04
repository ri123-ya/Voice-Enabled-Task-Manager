import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const parseTaskInput = async (transcript) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an intelligent task parser. Extract structured task details from the following user input:
      "${transcript}"

      Return ONLY a JSON object with the following fields:
      - title: (String) The main task description - what needs to be done
      - description: (String) Any ADDITIONAL context or details about the task. Do NOT include information about priority, status, or deadlines here. If the user only mentions priority/status/deadline without other details, leave this field empty (""). Only include substantive task details or notes.
      - priority: (String) One of "Low", "Medium", "High", "Critical". Default to "Medium" if not specified. Extract this from phrases like "high priority", "urgent", "critical", "low priority", etc.
      - dueDate: (String) ISO 8601 date string (YYYY-MM-DD) if a date is mentioned. Calculate relative dates (e.g., "tomorrow", "next friday", "next Wednesday") based on the current date: ${new Date().toISOString()}.
      - status: (String) One of "To Do", "In Progress", "Done". Default to "To Do".

      IMPORTANT: Do NOT put priority indicators (like "it's high priority"), status indicators, or deadline information in the description field. Only include substantive additional details about the task itself.
      
      Do not include markdown formatting like \`\`\`json. Just return the raw JSON string.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up potential markdown code blocks if the model adds them despite instructions
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error parsing task with AI:", error);
    throw new Error("Failed to parse task input");
  }
};
