// import { useDispatch, useSelector } from "react-redux";
// import { handleDatFileSelect } from "./utils/handlers/handleDatFileSelect";
// import { extractAllData } from "./services/parseDatFile";
// import { RootState } from "./state/Store";
// import {
//   setProject,
//   setFileType,
//   setTimeArray,
//   setAllYValues,
//   addSelectedGraph,
//   removeSelectedGraph,
// } from "./state/slices/projectSlice";
// import MinigraphGrid from "./components/MinigraphGrid/MinigraphGrid";
// import LargeGraph from "./components/LargeGraph/LargeGraph";

// const App = () => {
//   const dispatch = useDispatch();
//   const { project, dataExtracted, selectedGraphs } = useSelector(
//     (state: RootState) => state.project
//   );

//   const onToggleWell = (wellId: number) => {
//     if (selectedGraphs.includes(wellId)) {
//       dispatch(removeSelectedGraph(wellId)); // Remove the well if it's already selected
//     } else {
//       dispatch(addSelectedGraph(wellId)); // Add the well if it's not selected
//     }
//   };

//   const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       try {
//         const fileContent = await handleDatFileSelect(file);
//         const { project, timeArray, allYValues } = await extractAllData(
//           fileContent
//         );

//         // Dispatch the project, timeArray, and allYValues to Redux
//         dispatch(setProject(project));
//         dispatch(setTimeArray(timeArray));
//         dispatch(setAllYValues(allYValues));
//       } catch (error) {
//         console.error("Error processing file:", error);
//       }
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={onFileChange} />
//       {dataExtracted && project && (
//         <>
//           <MinigraphGrid
//             wells={project.plate[0]?.experiments[0]?.wells || []}
//             rows={project.plate[0]?.numberOfRows || 0}
//             columns={project.plate[0]?.numberOfColumns || 0}
//             onToggleWell={onToggleWell}
//           />
//           <LargeGraph /> {/* Add the LargeGraph component */}
//         </>
//       )}
//     </div>
//   );
// };

// export default App;
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleDatFileSelect } from "./utils/handlers/handleDatFileSelect";
import { extractAllData } from "./services/parseDatFile";
import {
  setProject,
  setFileType,
  setTimeArray,
  setAllYValues,
  addSelectedGraph,
  removeSelectedGraph,
} from "./state/slices/projectSlice";
import MinigraphGrid from "./components/MinigraphGrid/MinigraphGrid";
import LargeGraph from "./components/LargeGraph/LargeGraph";

const App = () => {
  const dispatch = useDispatch();
  const { project, dataExtracted, selectedGraphs } = useSelector(
    (state) => state.project
  );

  const onToggleWell = (wellId) => {
    if (selectedGraphs.includes(wellId)) {
      dispatch(removeSelectedGraph(wellId)); // Remove the well if it's already selected
    } else {
      dispatch(addSelectedGraph(wellId)); // Add the well if it's not selected
    }
  };

  const onFileChange = async (event) => {
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
        <>
          <MinigraphGrid
            wells={project.plate[0]?.experiments[0]?.wells || []}
            rows={project.plate[0]?.numberOfRows || 0}
            columns={project.plate[0]?.numberOfColumns || 0}
            onToggleWell={onToggleWell}
          />
          <LargeGraph />
        </>
      )}
    </div>
  );
};

export default App;
