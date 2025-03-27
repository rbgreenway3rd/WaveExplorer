// import React from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import { Well } from '../Models'; // Adjust the import path based on your project structure
// import { JSX } from 'react/jsx-runtime';

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// interface MinigraphGridProps {
//   wells: Well[];
//   rows: number;
//   columns: number;
//   onToggleWell: (wellId: number) => void;
// }

// export const MinigraphGrid: React.FC<MinigraphGridProps> = ({ wells, rows, columns, onToggleWell }): JSX.Element => {
//   return (
//     <div>
//       {wells.map((well: {}) => (
//         <div
//           key={well.id}
//           onClick={() => onToggleWell(well.id)}
//           style={{ cursor: 'pointer' }}
//         >
//           <Line
//             data={{
//               labels: well.indicators[0].time,
//               datasets: [
//                 {
//                   label: well.label,
//                   data: well.indicators[0].rawData,
//                   borderColor: 'rgba(75, 192, 192, 1)',
//                   backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                 },
//               ],
//             }}
//             options={{ maintainAspectRatio: false }}
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MinigraphGrid;

import React from "react";
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
} from "chart.js";
import { Well } from "../Models"; // Adjust the import path based on your project structure

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const MinigraphGrid = ({ wells, rows, columns, onToggleWell }) => {
  return (
    <div>
      {wells.map((well) => (
        <div
          key={well.id}
          onClick={() => onToggleWell(well.id)}
          style={{ cursor: "pointer" }}
        >
          <Line
            data={{
              labels: well.indicators[0].time,
              datasets: [
                {
                  label: well.label,
                  data: well.indicators[0].rawData,
                  borderColor: "rgba(75, 192, 192, 1)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                },
              ],
            }}
            options={{ maintainAspectRatio: false }}
          />
        </div>
      ))}
    </div>
  );
};

export default MinigraphGrid;
