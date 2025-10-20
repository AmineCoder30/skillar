import axios from "axios";
import type { Language } from "./translations";
import type { TechnologyId, TopicId } from "./content-data";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDTpcy0Z2eXWzbgiyoSg6UtOsDXgrIefns",
});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

interface AIResponse {
  content: Array<{
    text?: string;
    code?: string;
    title?: string;
  }>;
  suggestedQuestions: string[];
}

export async function getTopicExplanation(
  tech: TechnologyId,
  topic: TopicId,
  language: Language
): Promise<AIResponse> {
  try {
    const prompt = `Explain in arabic the topic "${topic}" in the programming language "${tech}" in a clear and structured way.

IMPORTANT: Return ONLY a valid JSON array, without any markdown code blocks or additional text.

Each element in the array should be an object with one of these structures:
- For text: {\"text\": \"Your explanation here\"}
- For code: {\"code\": \"const example = 'code here';\"}
- For section titles: {\"title\": \"Section Title\"}

Example response:
[\n  {\"title\": \"Introduction\"},\n  {\"text\": \"This is an explanation\"},\n  {\"code\": \"const example = 'code';\"}\n]

DO NOT include markdown code blocks (\`\`\`json or \`\`\`) in your response.`;

    console.log("Sending prompt to AI:", prompt);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response.text) {
      console.error("AI response is empty");
      throw new Error("Response text is undefined");
    }

    console.log("Raw response text:", response.text);

    let parsedContent;
    try {
      // Remove markdown code block markers if present
      let jsonString = response.text.trim();
      console.log("Response after trim:", jsonString);
      
      // Handle different markdown code block formats
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7); // Remove ```json
        const endIndex = jsonString.lastIndexOf('```');
        if (endIndex !== -1) {
          jsonString = jsonString.substring(0, endIndex);
        }
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.substring(3); // Remove ```
        const endIndex = jsonString.lastIndexOf('```');
        if (endIndex !== -1) {
          jsonString = jsonString.substring(0, endIndex);
        }
      }
      
      // Clean up any remaining whitespace
      jsonString = jsonString.trim();
      
      console.log("JSON string after cleanup:", jsonString);
      
      // Parse the JSON content
      parsedContent = JSON.parse(jsonString);
      console.log("Successfully parsed content:", parsedContent);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.error("Problematic content:", response.text);
      // Return a fallback response instead of throwing an error
      return getDefaultResponse(language);
    }

    return {
      content: parsedContent,
      suggestedQuestions: [
        "Can you provide more examples?",
        "What are common mistakes in this topic?",
        "How can I practice this concept?",
      ],
    };
  } catch (error) {
    console.error("Failed to fetch topic explanation from Gemini:", error);
    return getDefaultResponse(language);
  }
}

export async function generateFollowUpResponse(
  question: string,
  tech: TechnologyId,
  topic: TopicId,
  language: Language
): Promise<AIResponse> {
  try {
    const prompt = `Based on the topic "${topic}" in the programming language "${tech}", answer the following question in ${language}: ${question}.
Return the result strictly as a JSON array, where each element represents a block of text or code.

Rules:

If the block is a normal explanation or description, use the key "text".

If the block is a code example, use the key "code".

If needed, you can also include "title" for section headings.

Do not include any extra formatting, markdown, or explanations outside the JSON.

Keep the explanations simple and educational.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("Response text is undefined");
    }

    console.log("Raw follow-up response text:", response.text);

    let parsedContent;
    try {
      // Remove markdown code block markers if present
      let jsonString = response.text;
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*|\s*```$/g, '');
      } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*|\s*```$/g, '');
      }
      
      // Parse the JSON content
      parsedContent = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.error("Problematic content:", response.text);
      throw new Error("Invalid JSON format in response");
    }

    return {
      content: parsedContent,
      suggestedQuestions: [
        "Can you provide more examples?",
        "Can you give a simpler explanation?",
        "How can I practice this?",
      ],
    };
  } catch (error) {
    console.error("Failed to fetch follow-up response from Gemini:", error);
    return getDefaultResponse(language);
  }
}

function getDefaultResponse(language: Language): AIResponse {
  const defaultResponses = {
    en: {
      content: [{ text: "I'm sorry, I couldn't fetch the explanation. Please try again later." }],
      suggestedQuestions: [
        "What are the basics of this topic?",
        "Can you show me an example?",
        "Where can I learn more about this?",
      ],
    },
    es: {
      content: [{ text: "Lo siento, no pude obtener la explicación. Por favor, inténtalo de nuevo más tarde." }],
      suggestedQuestions: [
        "¿Cuáles son los conceptos básicos de este tema?",
        "¿Puedes mostrarme un ejemplo?",
        "¿Dónde puedo aprender más sobre esto?",
      ],
    },
    fr: {
      content: [{ text: "Je suis désolé, je n'ai pas pu récupérer l'explication. Veuillez réessayer plus tard." }],
      suggestedQuestions: [
        "Quelles sont les bases de ce sujet ?",
        "Pouvez-vous me montrer un exemple ?",
        "Où puis-je en savoir plus à ce sujet ?",
      ],
    },
    ar: {
      content: [{ text: "عذرًا، لم أتمكن من جلب الشرح. يرجى المحاولة مرة أخرى لاحقًا." }],
      suggestedQuestions: [
        "ما هي أساسيات هذا الموضوع؟",
        "هل يمكنك إعطائي مثالاً؟",
        "أين يمكنني معرفة المزيد عن هذا؟",
      ],
    },
  };

  return defaultResponses[language] || defaultResponses.en;
}
