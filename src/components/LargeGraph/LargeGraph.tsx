// import React, { useMemo } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../state/Store";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   registerables,
// } from "chart.js";

// // Register Chart.js components
// ChartJS.register(...registerables);

// const LargeGraph: React.FC = () => {
//   // Access Redux state
//   const selectedGraphs = useSelector(
//     (state: RootState) => state.project.selectedGraphs
//   );
//   const project = useSelector((state: RootState) => state.project.project);
//   const timeArray = useSelector((state: RootState) => state.project.timeArray);
//   const allYValues = useSelector(
//     (state: RootState) => state.project.allYValues
//   );
//   // Memoize the graph data to avoid unnecessary recalculations
//   const graphData = useMemo(() => {
//     if (!project || !timeArray || selectedGraphs.length === 0) return null;

//     // Cache wells for faster lookup
//     const wellsMap = new Map(
//       project.plate[0]?.experiments[0]?.wells.map((well) => [well.id, well])
//     );

//     const datasets = selectedGraphs.map((wellId) => {
//       const well = wellsMap.get(wellId);

//       if (!well || well.indicators.length === 0) {
//         return {
//           label: `Well ${wellId}`,
//           data: [],
//           borderColor: "rgba(200, 200, 200, 1)",
//           backgroundColor: "rgba(0, 0, 0, 0)",
//           borderWidth: 2,
//         };
//       }

//       const indicator = well.indicators[0];
//       return {
//         label: well.label,
//         data: indicator.rawData,
//         borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
//           Math.random() * 255
//         }, 1)`,
//         backgroundColor: "rgba(0, 0, 0, 0)",
//         borderWidth: 2,
//       };
//     });

//     const timeKeys = Object.keys(timeArray);
//     const labels = timeKeys.length > 0 ? timeArray[timeKeys[0]] : [];

//     return {
//       labels,
//       datasets,
//     };
//   }, [project, timeArray, selectedGraphs]);

//   return (
//     <div style={{ width: "100%", height: "400px" }}>
//       {graphData ? (
//         <Line
//           data={graphData}
//           options={{
//             responsive: true,
//             plugins: {
//               legend: {
//                 display: true,
//                 position: "top" as const,
//               },
//               tooltip: {
//                 mode: "index" as const,
//                 intersect: false,
//               },
//             },
//             scales: {
//               x: {
//                 type: "time",
//                 min: timeArray
//                   ? Math.min(...Object.values(timeArray).flat())
//                   : undefined,
//                 max: timeArray
//                   ? Math.max(...Object.values(timeArray).flat())
//                   : undefined,
//                 ticks: {
//                   display: false,
//                 },
//                 grid: {
//                   display: false,
//                 },
//               },
//               y: {
//                 min: allYValues
//                   ? Math.min(...Object.values(allYValues).flat())
//                   : undefined,
//                 max: allYValues
//                   ? Math.max(...Object.values(allYValues).flat())
//                   : undefined,
//                 ticks: {
//                   display: false,
//                 },
//                 grid: {
//                   display: false,
//                 },
//               },
//             },
//           }}
//         />
//       ) : (
//         <p>No wells selected. Please select wells to display the graph.</p>
//       )}
//     </div>
//   );
// };

// export default LargeGraph;
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../state/Store";
import { selectGraphData } from "../../state/slices/projectSlice";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  registerables,
} from "chart.js";

// Register Chart.js components
ChartJS.register(...registerables);

const LargeGraph: React.FC = () => {
  // Use the memoized selector
  const graphData = useSelector(selectGraphData);

  const project = useSelector((state: RootState) => state.project.project);
  const timeArray = useSelector((state: RootState) => state.project.timeArray);
  const allYValues = useSelector(
    (state: RootState) => state.project.allYValues
  );

  return (
    <div style={{ width: "100%", height: "400px" }}>
      {graphData ? (
        <Line
          data={graphData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: "top" as const,
              },
              tooltip: {
                mode: "index" as const,
                intersect: false,
              },
            },
            scales: {
              x: {
                type: "time",
                min: timeArray
                  ? Math.min(...Object.values(timeArray).flat())
                  : undefined,
                max: timeArray
                  ? Math.max(...Object.values(timeArray).flat())
                  : undefined,
                ticks: {
                  display: false,
                },
                grid: {
                  display: false,
                },
              },
              y: {
                min: allYValues
                  ? Math.min(...Object.values(allYValues).flat())
                  : undefined,
                max: allYValues
                  ? Math.max(...Object.values(allYValues).flat())
                  : undefined,
                ticks: {
                  display: false,
                },
                grid: {
                  display: false,
                },
              },
            },
          }}
        />
      ) : (
        <p>No wells selected. Please select wells to display the graph.</p>
      )}
    </div>
  );
};

export default LargeGraph;
