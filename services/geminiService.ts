import { GoogleGenAI, Type } from "@google/genai";
import { StudyGuide } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const studyGuideSchema = {
  type: Type.OBJECT,
  properties: {
    flashcards: {
      type: Type.ARRAY,
      description: 'Key terms and their definitions.',
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          definition: { type: Type.STRING },
        },
        required: ['term', 'definition'],
      },
    },
    mcqs: {
      type: Type.ARRAY,
      description: 'Multiple choice questions.',
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          answer: { type: Type.STRING },
        },
        required: ['question', 'options', 'answer'],
      },
    },
    fillInTheBlanks: {
      type: Type.ARRAY,
      description: 'Sentences with a word missing.',
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: 'The sentence with a blank, often represented by ___.' },
          answer: { type: Type.STRING },
        },
        required: ['question', 'answer'],
      },
    },
    whatIsThisCalled: {
      type: Type.ARRAY,
      description: 'Questions where a description is given and the user must name the term.',
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          answer: { type: Type.STRING },
        },
        required: ['description', 'answer'],
      },
    },
    definitions: {
      type: Type.ARRAY,
      description: 'Questions asking for the definition of a term.',
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING },
          definition: { type: Type.STRING },
        },
        required: ['term', 'definition'],
      },
    },
    programmingQuestions: {
      type: Type.ARRAY,
      description: 'Programming or code-related questions, if applicable to the text. Otherwise, this array should be empty.',
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING, description: 'An explanation or code snippet as the answer.' },
        },
        required: ['question', 'answer'],
      },
    },
    examSheet: {
      type: Type.ARRAY,
      description: 'A 30-minute exam sheet with a mix of 10-15 questions from the categories above.',
      items: {
        type: Type.OBJECT,
        properties: {
          questionNumber: { type: Type.NUMBER },
          questionType: { type: Type.STRING, enum: ['MCQ', 'FillInTheBlank', 'WhatIsThisCalled', 'Definition', 'Programming'] },
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, description: 'Only for MCQ type questions.', items: { type: Type.STRING } },
        },
        required: ['questionNumber', 'questionType', 'question'],
      },
    },
  },
  required: [
    'flashcards', 'mcqs', 'fillInTheBlanks', 'whatIsThisCalled',
    'definitions', 'programmingQuestions', 'examSheet'
  ],
};

export const generateStudyMaterials = async (documentText: string): Promise<StudyGuide> => {
  const prompt = `
    Based on the following document text, act as an expert educational content creator and curriculum designer.
    Generate a comprehensive study guide. The guide must include the following sections in this exact order:
    1. Flashcards: Key terms and their definitions.
    2. MCQs: Multiple choice questions with 4 options and a correct answer. These should cover a range of difficulties.
    3. Fill in the blanks: Sentences with a key word or phrase missing. Use "___" to represent the blank.
    4. What is this called?: Provide a definition or description and ask for the corresponding term.
    5. Definition: Provide a term and ask for its definition.
    6. Programming questions: Generate a generous number of programming questions if the document contains any code snippets, algorithms, technical specifications, or discusses software development concepts. These questions should involve code analysis, debugging, or writing small code snippets. If the topic is not technical at all, this array must be empty.
    7. 30-min Exam Sheet: Create a challenging exam of 10-15 questions suitable for a 30-minute test. These exam questions must be more difficult and in-depth than the practice questions in the sections above. They should test for deeper understanding, application of concepts, and synthesis of information from different parts of the document. Include a mix of question types, prioritizing those that require critical thinking and problem-solving. Some questions in the exam can be completely new and not derived from the earlier sections.

    Here is the document text:
    ---
    ${documentText.substring(0, 200000)}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: studyGuideSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as StudyGuide;
  } catch (error) {
    console.error("Error generating study materials:", error);
    throw new Error("Failed to generate study guide from the AI. The content might be too complex or the service may be temporarily unavailable.");
  }
};
