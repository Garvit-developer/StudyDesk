require("dotenv").config();
const { ChatGroq } = require("@langchain/groq");


const GROQ_API_KEY = process.env.GROQ_API_KEY;

const createGroqModel = (temperature = 0.4) => {
  return new ChatGroq({
    apiKey: GROQ_API_KEY,
    model: "openai/gpt-oss-120b",
    temperature: temperature,    
  });
};

module.exports = createGroqModel;