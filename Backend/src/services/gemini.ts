import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);
const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash"
});
export const askGemini = async(message:string)=>{

    const result = await model.generateContent(message);

    const response = result.response.text();

    return response;
}