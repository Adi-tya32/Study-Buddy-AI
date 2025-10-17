
export interface Flashcard {
  term: string;
  definition: string;
}

export interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

export interface FillInTheBlank {
  question: string;
  answer: string;
}

export interface WhatIsThisCalled {
  description: string;
  answer: string;
}

export interface Definition {
  term: string;
  definition: string;
}

export interface ProgrammingQuestion {
  question: string;
  answer: string;
}

export interface ExamQuestion {
  questionNumber: number;
  questionType: 'MCQ' | 'FillInTheBlank' | 'WhatIsThisCalled' | 'Definition' | 'Programming';
  question: string;
  options?: string[]; // Only for MCQ
}


export interface StudyGuide {
  flashcards: Flashcard[];
  mcqs: MCQ[];
  fillInTheBlanks: FillInTheBlank[];
  whatIsThisCalled: WhatIsThisCalled[];
  definitions: Definition[];
  programmingQuestions: ProgrammingQuestion[];
  examSheet: ExamQuestion[];
}

export enum StudySection {
    FLASHCARDS = "Flashcards",
    MCQS = "Multiple Choice",
    FILL_IN_THE_BLANKS = "Fill in the Blanks",
    WHAT_IS_THIS_CALLED = "What is this called?",
    DEFINITIONS = "Definitions",
    PROGRAMMING = "Programming Questions",
    EXAM_SHEET = "30-Min Exam"
}
