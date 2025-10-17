
import React, { useState } from 'react';
import { StudyGuide, StudySection } from '../types';
import Flashcard from './Flashcard';
import QuestionCard from './QuestionCard';

interface StudyGuideDisplayProps {
  guide: StudyGuide;
}

const StudyGuideDisplay: React.FC<StudyGuideDisplayProps> = ({ guide }) => {
  const [activeTab, setActiveTab] = useState<StudySection>(StudySection.FLASHCARDS);

  const sections = Object.values(StudySection).filter(section => {
    switch (section) {
      case StudySection.FLASHCARDS: return guide.flashcards.length > 0;
      case StudySection.MCQS: return guide.mcqs.length > 0;
      case StudySection.FILL_IN_THE_BLANKS: return guide.fillInTheBlanks.length > 0;
      case StudySection.WHAT_IS_THIS_CALLED: return guide.whatIsThisCalled.length > 0;
      case StudySection.DEFINITIONS: return guide.definitions.length > 0;
      case StudySection.PROGRAMMING: return guide.programmingQuestions.length > 0;
      case StudySection.EXAM_SHEET: return guide.examSheet.length > 0;
      default: return false;
    }
  });

  const renderContent = () => {
    switch (activeTab) {
      case StudySection.FLASHCARDS:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guide.flashcards.map((fc, index) => <Flashcard key={index} term={fc.term} definition={fc.definition} />)}
          </div>
        );
      case StudySection.MCQS:
        return (
          <div className="space-y-4">
            {guide.mcqs.map((q, index) => <QuestionCard key={index} type="MCQ" questionData={q} />)}
          </div>
        );
      case StudySection.FILL_IN_THE_BLANKS:
        return (
          <div className="space-y-4">
            {guide.fillInTheBlanks.map((q, index) => <QuestionCard key={index} type="FillInTheBlank" questionData={q} />)}
          </div>
        );
      case StudySection.WHAT_IS_THIS_CALLED:
         return (
          <div className="space-y-4">
            {guide.whatIsThisCalled.map((q, index) => <QuestionCard key={index} type="WhatIsThisCalled" questionData={q} />)}
          </div>
        );
      case StudySection.DEFINITIONS:
        return (
            <div className="space-y-4">
            {guide.definitions.map((q, index) => <QuestionCard key={index} type="Definition" questionData={q} />)}
          </div>
        );
      case StudySection.PROGRAMMING:
        return (
          <div className="space-y-4">
            {guide.programmingQuestions.map((q, index) => <QuestionCard key={index} type="Programming" questionData={q} />)}
          </div>
        );
      case StudySection.EXAM_SHEET:
        return (
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
             <h3 className="text-2xl font-bold mb-4 text-center text-cyan-300">30-Minute Exam</h3>
             <div className="space-y-6">
                {guide.examSheet.map(q => (
                    <div key={q.questionNumber} className="border-b border-slate-700 pb-4 last:border-b-0">
                        <p className="font-bold mb-2">{q.questionNumber}. <span className="text-slate-300">{q.question}</span></p>
                        {q.questionType === 'MCQ' && q.options && (
                            <ul className="list-disc list-inside ml-4 space-y-1 text-slate-400">
                                {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                            </ul>
                        )}
                    </div>
                ))}
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-8">
      <div className="mb-6 border-b border-slate-700">
        <nav className="-mb-px flex flex-wrap gap-x-4 gap-y-2" aria-label="Tabs">
          {sections.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-purple-400 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default StudyGuideDisplay;
