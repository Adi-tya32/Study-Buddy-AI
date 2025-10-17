
import React, { useState } from 'react';
import { MCQ, FillInTheBlank, WhatIsThisCalled, Definition, ProgrammingQuestion } from '../types';

type QuestionType = 'MCQ' | 'FillInTheBlank' | 'WhatIsThisCalled' | 'Definition' | 'Programming';

interface QuestionCardProps {
  type: QuestionType;
  questionData: MCQ | FillInTheBlank | WhatIsThisCalled | Definition | ProgrammingQuestion;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ type, questionData }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const getQuestionText = () => {
    switch (type) {
      case 'MCQ': return (questionData as MCQ).question;
      case 'FillInTheBlank': return (questionData as FillInTheBlank).question;
      case 'WhatIsThisCalled': return (questionData as WhatIsThisCalled).description;
      case 'Definition': return `What is the definition of "${(questionData as Definition).term}"?`;
      case 'Programming': return (questionData as ProgrammingQuestion).question;
      default: return '';
    }
  };

  const getAnswerText = () => {
    switch (type) {
      case 'Definition': return (questionData as Definition).definition;
      default: return (questionData as any).answer;
    }
  };

  const renderMCQOptions = () => {
    if (type !== 'MCQ') return null;
    const mcq = questionData as MCQ;

    return (
        <div className="space-y-2 mt-4">
            {mcq.options.map((option, index) => {
                const isCorrect = option === mcq.answer;
                const isSelected = selectedOption === option;
                let optionClass = "block w-full text-left p-3 rounded-md transition-colors duration-200 border";
                
                if (showAnswer) {
                    if(isCorrect) {
                        optionClass += " bg-green-500/20 border-green-500 text-slate-100";
                    } else if (isSelected && !isCorrect) {
                        optionClass += " bg-red-500/20 border-red-500 text-slate-100";
                    } else {
                        optionClass += " border-slate-600 text-slate-300";
                    }
                } else {
                   optionClass += isSelected ? " bg-purple-500/20 border-purple-500 text-slate-100" : " bg-slate-800 border-slate-700 hover:bg-slate-700/50";
                }

                return (
                    <button key={index} onClick={() => !showAnswer && setSelectedOption(option)} className={optionClass} disabled={showAnswer}>
                        {option}
                    </button>
                );
            })}
        </div>
    );
  };

  return (
    <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-6 shadow-md">
      <p className="text-slate-300 leading-relaxed">{getQuestionText()}</p>
      {renderMCQOptions()}
      <div className="mt-4 flex justify-end">
        {showAnswer ? (
          <div className="bg-slate-700 p-3 rounded-md text-cyan-300 w-full">
            <p className="font-bold">Answer:</p>
            <p className="whitespace-pre-wrap font-mono">{getAnswerText()}</p>
          </div>
        ) : (
          <button
            onClick={() => setShowAnswer(true)}
            className="px-4 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-md hover:bg-cyan-700 transition-colors"
          >
            Show Answer
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
