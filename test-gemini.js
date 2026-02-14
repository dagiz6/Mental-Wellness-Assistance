const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    // There is no direct listModels in the main export of @google/generative-ai
    // but we can try common alternatives or check the API key validity.
    console.log("Checking API Key validity and common models...");

    const models = ["gemini-2.0-flash", "gemini-2.0-flash-001", "gemini-flash-latest"];

    for (const modelName of models) {
      try {
        console.log(`Testing ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hi");
        console.log(`Success with ${modelName}:`, result.response.text());
        return;
      } catch (e) {
        console.log(`Failed ${modelName}:`, e.message);
      }
    }
  } catch (error) {
    console.error("General Error:", error.message);
  }
}

listModels();
