const generateAIResponse = async (message) => {
  const { GoogleGenAI } = await import("@google/genai");

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const interaction = await ai.interactions.create({
    model: "gemini-3.8-flash",
    input: message,
    store: false,
  });

  return interaction.output_text;
};

module.exports = {
  generateAIResponse,
};