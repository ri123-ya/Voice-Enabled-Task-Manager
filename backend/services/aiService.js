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

      Current Date/Time: ${new Date().toISOString()}

      Return ONLY a JSON object with the following fields:
      - title: (String) The COMPLETE task description including all core details (what needs to be done, for whom, about what topic). Examples:
        * Input: "Send email to team about project updates" → Title: "Send email to team about project updates"
        * Input: "Call John regarding the contract" → Title: "Call John regarding the contract" 
        * Input: "Prepare presentation for client meeting" → Title: "Prepare presentation for client meeting"
        The title should be a complete, standalone description of the task.
        
      - description: (String) ONLY extra instructions, implementation details, or notes that go BEYOND the basic task. 
        * Do NOT include the subject/topic of the task here - that belongs in the title.
        * Do NOT include priority indicators, status, or deadline information.
        * Examples of valid descriptions: "Include budget breakdown and timeline", "Focus on security vulnerabilities", "Use the new template from marketing"
        * If there are no extra details beyond the basic task, status, priority, and deadline, leave this field empty ("").
        
      - priority: (String) One of "Urgent", "High Priority", "Low Priority", "Critical". 
        * Default to "Low Priority" if not specified.
        * Map "high" to "High Priority".
        * Map "medium" or "normal" to "Low Priority".
        * Map "urgent" to "Urgent".
        * Map "critical" to "Critical".
      
      - dueDate: (String/null) ISO 8601 date string (YYYY-MM-DD) if a date is mentioned. 
        * You MUST calculate the exact date based on the "Current Date/Time" provided above.
        * Example: If current date is 2023-10-27 and input says "tomorrow", return "2023-10-28".
        * Example: If input says "next Friday", calculate the date of the next Friday.
        * STRICTLY return the date in "YYYY-MM-DD" format. Do NOT return words like "tomorrow", "today", or "Monday".
        * Return null if no specific due date is mentioned.

      - status: (String) One of "To Do", "In Progress", "Done". Default to "To Do".

      IMPORTANT: Do NOT put priority indicators (like "it's high priority"), status indicators, or deadline information in the description field. Only include substantive additional details about the task itself.
      
      CRITICAL RULES:
      1. The title must be COMPLETE and include the subject/topic (e.g., "about project updates", "regarding the contract")
      2. Do NOT split the basic task between title and description
      3. Description is ONLY for extra instructions or implementation details
      4. If the input only mentions what to do, priority, and deadline → description should be empty ("")
      
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
