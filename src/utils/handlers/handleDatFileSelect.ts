export const handleDatFileSelect = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target?.result as string;
      resolve(fileContent);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};
