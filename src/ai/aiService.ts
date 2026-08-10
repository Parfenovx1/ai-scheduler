import Groq from "groq-sdk";
import { GROQ_API_KEY } from "@env";
import {
  handleCalendarRequest,
  isCalendarRequest,
} from "../calendar/calendarService";
import { AI_STRINGS } from "../constants/aiStrings";

const groq = new Groq({ apiKey: GROQ_API_KEY });

export const askAI = async (message: string): Promise<string> => {
  try {
    if (isCalendarRequest(message)) {
      return await handleCalendarRequest(message);
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }],
    });

    return completion.choices[0]?.message?.content ?? AI_STRINGS.genericErrorMessage;
  } catch (error: any) {
    console.error("Error in AI service:", error?.message ?? error);

    const status = error?.status ?? error?.response?.status;
    if (status === 401 || status === 403) {
      return AI_STRINGS.authErrorMessage;
    }
    if (status === 429) {
      return AI_STRINGS.quotaErrorMessage;
    }

    return AI_STRINGS.genericErrorMessage;
  }
};
