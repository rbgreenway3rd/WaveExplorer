import { useDispatch, useSelector } from "react-redux";
import { handleDatFileSelect } from "./utils/handlers/handleDatFileSelect";
import { extractAllData } from "./services/parseDatFile";
import { RootState } from "./state/Store";
import {
  setProject,
  setFileType,
  setTimeArray,
  setAllYValues,
} from "./state/slices/projectSlice";
import MinigraphGrid from "./components/MinigraphGrid/MinigraphGrid";

const App = () => {
  const dispatch = useDispatch();
  const { project, dataExtracted } = useSelector(
    (state: RootState) => state.project
  );

  // const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     try {
  //       const fileContent = await handleDatFileSelect(file);
  //       const extractedProject = await extractAllData(fileContent);

  //       // Dispatch the project and file type
  //       dispatch(setProject(extractedProject.project));
  //       dispatch(setFileType("dat"));

  //       // Dispatch the timeArray (indicatorTimes)
  //       const timeArray = extractedProject.project.plate[0].experiments[0].wells[0].indicators[0].time; // Ensure `time` is returned as a number[]
  //       dispatch(setTimeArray({ default: timeArray }));
  //       // dispatch(setAllYValues({allYValues})); // Ensure `analysisData` is returned as a number[]
  //     } catch (error) {
  //       console.error("Error processing file:", error);
  //     }
  //   }
  // };
  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileContent = await handleDatFileSelect(file);
        const { project, timeArray, allYValues } = await extractAllData(
          fileContent
        );

        // Dispatch the project, timeArray, and allYValues to Redux
        dispatch(setProject(project));
        dispatch(setTimeArray(timeArray));
        dispatch(setAllYValues(allYValues));
      } catch (error) {
        console.error("Error processing file:", error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      {dataExtracted && project && (
        <MinigraphGrid
          wells={project.plate[0]?.experiments[0]?.wells || []}
          rows={project.plate[0]?.numberOfRows || 0}
          columns={project.plate[0]?.numberOfColumns || 0}
          onToggleWell={(wellId: number) =>
            console.log(`Toggled well: ${wellId}`)
          }
        />
      )}
    </div>
  );
};

export default App;
