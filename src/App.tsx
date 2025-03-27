// Assuming React with TypeScript
import { useState } from "react";
import { handleDatFileSelect } from "./utils/handlers/handleDatFileSelect";
import { extractAllData } from "./services/parseDatFile";
import { Project } from "./Models"

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
          <h2>Project: {project?.title}</h2>
          <p>Date: {project?.date}</p>
          <p>Time: {project?.time}</p>
          <p>Instrument: {project?.instrument}</p>
          <p>Protocol: {project?.protocol}</p>
          <h3>Plates:</h3>
          {project?.plate.map((plate, index) => (
            <div key={index}>
              <h4>Plate {index + 1}</h4>
              <p>Number of Rows: {plate.numberOfRows}</p>
              <p>Number of Columns: {plate.numberOfColumns}</p>
              <p>Assay Plate Barcode: {plate.assayPlateBarcode}</p>
              <p>Add Plate Barcode: {plate.addPlateBarcode}</p>
              <h5>Experiments:</h5>
              {plate.experiments.map((experiment, index) => (
                <div key={index}>
                  <h6>Experiment {index + 1}</h6>
                  <p>Binning: {experiment.binning}</p>
                  <p>Number of Rows: {experiment.numberOfRows}</p>
                  <p>Number of Columns: {experiment.numberOfColumns}</p>
                  <p>Operator: {experiment.operator}</p>
                </div>
              ))}
              
        </div>
      ))}
    </div>
    )  
};
</div>
);}

export default App;