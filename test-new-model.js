const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function testModel() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const modelName = "gemini-2.5-flash-lite";
        console.log(`Testing ${modelName}...`);

        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you active?");
        console.log(`Success with ${modelName}:`, result.response.text());
    } catch (error) {
        console.error("Error testing model:", error.message);
        // Fallback check
        if (error.message.includes("404")) {
            console.log("Model not found. Suggesting fallback to gemini-1.5-flash");
        }
    }
}

testModel();
