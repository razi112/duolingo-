
import { GoogleGenAI, Type } from "@google/genai";
import { Exercise, ExerciseType, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateExercises = async (language: Language, unitTitle: string, difficulty: number): Promise<Exercise[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 5 varied language learning exercises for ${language} for a lesson titled "${unitTitle}". 
    The difficulty level is ${difficulty} (1-10). 
    Include translation (Target to English) and multiple choice.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { 
              type: Type.STRING, 
              enum: [ExerciseType.TRANSLATION, ExerciseType.MULTIPLE_CHOICE] 
            },
            prompt: { type: Type.STRING, description: "The sentence or question to present to the user" },
            correctAnswer: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Only for multiple choice" 
            },
            difficulty: { type: Type.NUMBER }
          },
          required: ["id", "type", "prompt", "correctAnswer", "difficulty"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse exercises", e);
    return [];
  }
};

export const getExplanation = async (language: Language, exercise: Exercise, userAnswer: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain why the answer "${userAnswer}" is incorrect for the ${language} exercise: "${exercise.prompt}". 
    The correct answer is "${exercise.correctAnswer}". 
    Keep the explanation short, encouraging, and helpful like a friendly language tutor.`,
  });

  return response.text || "Keep trying! You're getting better.";
};
