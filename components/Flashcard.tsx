
import React, { useState } from 'react';

interface FlashcardProps {
  term: string;
  definition: string;
}

const Flashcard: React.FC<FlashcardProps> = ({ term, definition }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000 h-64" onClick={() => setIsFlipped(!isFlipped)}>
      <div 
        className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden bg-slate-800 border border-slate-700 rounded-lg shadow-lg flex items-center justify-center p-4 cursor-pointer">
          <p className="text-lg font-semibold text-center text-cyan-300">{term}</p>
        </div>
        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden bg-slate-700 border border-slate-600 rounded-lg shadow-lg flex items-center justify-center p-4 cursor-pointer rotate-y-180">
          <p className="text-sm text-center text-slate-300">{definition}</p>
        </div>
      </div>
       <style>{`
          .perspective-1000 { perspective: 1000px; }
          .transform-style-preserve-3d { transform-style: preserve-3d; }
          .rotate-y-180 { transform: rotateY(180deg); }
          .backface-hidden { backface-visibility: hidden; }
        `}</style>
    </div>
  );
};

export default Flashcard;
