
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Ensure API_KEY is accessed correctly. This is critical.
// The user of this component MUST ensure process.env.API_KEY is set in their environment.
const apiKey = process.env.API_KEY;

if (!apiKey) {
  // This error will be thrown when the service module is loaded if API_KEY is not set.
  // It's better to fail early.
  throw new Error("API_KEY is not defined in environment variables. Please set process.env.API_KEY.");
}

const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash-preview-04-17'; // Use the specified model

const systemInstruction = `你是一个友善且乐于助人的超市客服机器人。
你的主要职责是回答顾客关于超市产品、服务、促销活动、营业时间、门店位置等方面的问题。
请用简洁、清晰、礼貌的中文回答。
如果遇到无法回答的问题，请礼貌地告知用户你无法提供帮助，并建议他们联系人工客服。
避免提及你是AI或语言模型。直接以客服身份回答。
`;

export const initChatSession = (): Chat => {
  try {
    const chat = ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: systemInstruction,
        // Optional: Add other config like temperature, topK, topP if needed
        // temperature: 0.7, 
        // topK: 50,
      },
    });
    return chat;
  } catch (error) {
    console.error("Error initializing chat session:", error);
    throw new Error(`Failed to initialize chat session: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    // Construct a more informative error message
    let errorMessage = "与AI服务通信时发生错误。";
    if (error instanceof Error) {
        // Attempt to parse specific Gemini API error details if available
        // This is a generic approach; specific error structures might vary
        const googleError = error as any; // Cast to any to check for common error properties
        if (googleError.message) {
            errorMessage = googleError.message;
        }
        if (googleError.details) {
            errorMessage += ` 详细信息: ${googleError.details}`;
        }
        if (googleError.status) {
             errorMessage += ` 状态码: ${googleError.status}`;
        }
    } else {
        errorMessage = String(error);
    }
    throw new Error(`发送消息失败: ${errorMessage}`);
  }
};
