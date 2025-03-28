import React, { useEffect } from "react";
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
import { Well } from "../../Models";
import "chartjs-adapter-date-fns"; // adapter for x-scale - "time scale"
import { minigraphOptions } from "./minigraphOptions";
import { useSelector } from "react-redux";
import { RootState } from "../../state/Store";
import { useDispatch } from "react-redux";
import { addSelectedGraph } from "../../state/slices/projectSlice";

// Register Chart.js components
ChartJS.register(...registerables);

// Define the props for the MinigraphGrid component
interface MinigraphGridProps {
  wells: Well[]; // Use the Well class from Models.ts
  rows: number;
  columns: number;
  onToggleWell: (id: number) => void; // Adjusted to match the Well class's id type
}

export const MinigraphGrid: React.FC<MinigraphGridProps> = ({
  wells,
  rows,
  columns,
  onToggleWell,
}) => {
  const dispatch = useDispatch();

  let gridHeight = window.innerHeight / 2;
  let gridWidth = gridHeight * 1.5; // Maintain a 1.5-to-1 ratio
  let cellHeight = gridHeight / rows;
  let cellWidth = cellHeight * 1.5; // Maintain a 1.5-to-1 ratio

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateRows: `repeat(${rows}, ${cellHeight}px)`,
    gridTemplateColumns: `repeat(${columns}, ${cellHeight * 1.5}px)`,
    gap: "0px", // Adjust the gap between grid items as needed
    overflow: "auto", // Add scrollbars if the content overflows
    margin: "0 auto", // Center the container horizontally
  };

  const timeArray = useSelector((state: RootState) => state.project.timeArray);
  const allYValues = useSelector(
    (state: RootState) => state.project.allYValues
  );
  const project = useSelector((state: RootState) => state.project.project);
  const selectedGraphs = useSelector(
    (state: RootState) => state.project.selectedGraphs
  );

  // console.log("Project:", project);
  // console.log("Selected Graphs:", selectedGraphs);

  // Reorganize wells into column-major order for proper grid layout
  const transposedWells = Array.from({ length: columns }, (_, colIndex) =>
    wells.filter((well) =>
      well.label.startsWith(String.fromCharCode(65 + colIndex))
    )
  ).flat();

  useEffect(() => {
    console.log("Selected Graphs Updated:", selectedGraphs);
  }, [selectedGraphs]); // This will log whenever selectedGraphs changes

  return (
    // <div style={containerStyle}>
    <div style={gridStyle}>
      {transposedWells.map((well) => (
        <Line
          key={well.id}
          onClick={() => {
            dispatch(addSelectedGraph(well.id)); // Dispatch action to add graph to selectedGraphs
            onToggleWell(well.id); // Call the provided onToggleWell function
            // console.log(selectedGraphs);
          }}
          style={{
            border: "1px solid #ccc",
            width: "100%",
            height: "100%",
            maxWidth: cellWidth,
            maxHeight: cellHeight,
          }}
          data={{
            labels: well.indicators[0]?.time || [], // Use optional chaining to avoid runtime errors
            datasets: [
              {
                label: well.label,
                data: well.indicators[0]?.rawData || [], // Use optional chaining to avoid runtime errors
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
              },
            ],
          }}
          options={{
            maintainAspectRatio: true,
            responsive: true,
            spanGaps: false,
            plugins: {
              legend: { display: false },
              decimation: {
                enabled: true,
                algorithm: "lttb",
                samples: 40,
                threshold: 80,
              },
              tooltip: {
                enabled: false,
                mode: "nearest",
                intersect: false,
              },
            },
            elements: {
              point: {
                radius: 0,
              },
              line: {
                borderWidth: 1.5,
              },
            },
            layout: {
              autoPadding: false,
              padding: {
                left: -30,
                bottom: -30,
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
        // </div>
      ))}
    </div>
    // </div>
  );
};

export default MinigraphGrid;
