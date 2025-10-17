
// This is necessary because the pdf.js library is loaded from a CDN
declare const pdfjsLib: any;

// This is necessary because mammoth.js is loaded from a CDN
declare const mammoth: any;

export const extractTextFromFile = async (file: File): Promise<string> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return extractTextFromPdf(file);
    case 'docx':
      return extractTextFromDocx(file);
    case 'md':
    case 'txt':
      return extractTextFromTextFile(file);
    default:
      throw new Error(`Unsupported file type: .${extension}`);
  }
};

const extractTextFromPdf = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error('Failed to read PDF file.'));
      }
      try {
        if (typeof pdfjsLib === 'undefined') {
          return reject(new Error('pdf.js library is not loaded.'));
        }
        
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs`;

        const pdf = await pdfjsLib.getDocument({ data: event.target.result }).promise;
        let textContent = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          textContent += text.items.map((item: any) => item.str).join(' ') + '\n';
        }
        resolve(textContent);
      } catch (error) {
        reject(new Error('Error parsing PDF file. It might be corrupted or password-protected.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsArrayBuffer(file);
  });
};

const extractTextFromDocx = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error('Failed to read DOCX file.'));
      }
      try {
        if (typeof mammoth === 'undefined') {
          return reject(new Error('mammoth.js library is not loaded.'));
        }
        const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
        resolve(result.value);
      } catch (error) {
        reject(new Error('Error parsing DOCX file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsArrayBuffer(file);
  });
};

const extractTextFromTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        resolve(event.target.result);
      } else {
        reject(new Error('Failed to read text file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
};
