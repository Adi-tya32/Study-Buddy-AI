
import React, { useState, useCallback } from 'react';

interface FileUploadProps {
  onFileChange: (file: File) => void;
  isProcessing: boolean;
  onGenerate: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, isProcessing, onGenerate }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = useCallback((file: File | null) => {
    if (file) {
      if (['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/markdown', 'text/plain'].includes(file.type)) {
        setFileName(file.name);
        onFileChange(file);
      } else {
        alert('Unsupported file type. Please upload a .pdf, .docx, .md, or .txt file.');
      }
    }
  }, [onFileChange]);

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
  };
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const onFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div 
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative w-full p-8 border-2 border-dashed rounded-xl transition-colors duration-300 ${isDragging ? 'border-purple-400 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onFileChangeHandler}
          accept=".pdf,.docx,.md,.txt"
          disabled={isProcessing}
        />
        <div className="flex flex-col items-center justify-center text-center">
          <svg className="w-12 h-12 mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          <p className="text-slate-300">
            <span className="font-semibold text-purple-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500 mt-1">PDF, DOCX, MD, or TXT</p>
          {fileName && <p className="text-sm text-cyan-400 mt-4 font-medium">{fileName}</p>}
        </div>
      </div>
      
      <button
        onClick={onGenerate}
        disabled={isProcessing || !fileName}
        className="w-full sm:w-auto px-8 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 transition-all duration-300 transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
      >
        {isProcessing ? 'Generating...' : 'Generate Study Guide'}
      </button>
    </div>
  );
};

export default FileUpload;
