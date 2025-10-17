
import React, { useState, useCallback } from 'react';
import { StudyGuide } from './types';
import { generateStudyMaterials } from './services/geminiService';
import FileUpload from './components/FileUpload';
import StudyGuideDisplay from './components/StudyGuideDisplay';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import { extractTextFromFile } from './utils/fileParser';

// Extend the Window interface for TypeScript to recognize mammoth
declare global {
  interface Window {
    mammoth: any;
  }
}

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [studyGuide, setStudyGuide] = useState<StudyGuide | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setStudyGuide(null);
    setError(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsProcessing(true);
    setStudyGuide(null);
    setError(null);

    try {
      const documentText = await extractTextFromFile(file);
      if (!documentText) {
        throw new Error('Could not extract text from the file. It might be empty or corrupted.');
      }
      
      const generatedGuide = await generateStudyMaterials(documentText);
      setStudyGuide(generatedGuide);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
    } finally {
      setIsProcessing(false);
    }
  }, [file]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
          Study Buddy AI
        </h1>
        <p className="text-slate-400 text-lg">
          Upload your course material and get a personalized study guide in seconds.
        </p>
      </header>

      <main className="w-full max-w-5xl flex-grow">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-700">
          <FileUpload onFileChange={handleFileChange} isProcessing={isProcessing} onGenerate={handleGenerate} />
          
          {isProcessing && <Loader />}
          {error && <ErrorMessage message={error} />}
          {studyGuide && !isProcessing && <StudyGuideDisplay guide={studyGuide} />}
        </div>
      </main>

      <footer className="w-full max-w-5xl text-center mt-8 text-slate-500 text-sm">
        <p>Powered by Google Gemini. For educational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
