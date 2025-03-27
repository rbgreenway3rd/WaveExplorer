// Assuming React with TypeScript
import { useState } from "react";
import { handleDatFileSelect } from "./utils/handlers/handleDatFileSelect";
import { extractAllData } from "./services/parseDatFile";
import { Project } from "./Models"
import MinigraphGrid from "./components/MinigraphGrid";

const App = () => {
  const [fileType, setFileType] = useState<string | null>(null);
  const [dataExtracted, setDataExtracted] = useState(false);
  const [project, setProject] = useState<Project | null>(null);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileContent = await handleDatFileSelect(file);
        const extractedProject = await extractAllData(fileContent);
        setProject(extractedProject);
        setFileType("dat");
        setDataExtracted(true);
        console.log(extractedProject)
      } catch (error) {
        console.error("Error processing file:", error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      {dataExtracted && (
        
    <div>
      <MinigraphGrid
        wells={project?.plate[0]?.experiments[0]?.wells || []}
        rows={project?.plate[0]?.numberOfRows || 0}
        columns={project?.plate[0]?.numberOfColumns || 0}
        onToggleWell={(wellId: string) => console.log(`Toggled well: ${wellId}`)}
        />
    </div>
    
      
    )  
};
</div>
);}

export default App;