
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      <p className="mt-4 text-slate-400">AI is studying your document...</p>
      <p className="text-sm text-slate-500">This may take a moment for large files.</p>
    </div>
  );
};

export default Loader;
