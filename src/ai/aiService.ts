import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_AI_API_KEY } from "@env";
import {
  handleCalendarRequest,
  isCalendarRequest,
} from "../calendar/calendarService";

const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);

export const askAI = async (message: string): Promise<string> => {
  try {
    if (isCalendarRequest(message)) {
      return await handleCalendarRequest(message);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Error in AI service:", error.message);
    return "Произошла ошибка при обработке запроса";
  }
};
