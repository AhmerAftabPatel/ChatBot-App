const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("");

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });