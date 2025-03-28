import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
Chart.register(...registerables);

export const minigraphOptions = () => {
  return {
    maintainAspectRatio: true,
    spanGaps: false,
    // parsing: false,
    plugins: {
      legend: { display: false },
      decimation: {
        enabled: false,
        algorithm: "lttb",
        samples: 40,
        threshold: 80,
      },
      tooltip: {
        enabled: true, // set to FALSE if using an external function for tooltip
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
      // padding: {
      //   left: -30,
      //   bottom: -30,
      // },
    },
    scales: {
      x: {
        type: "time",
        // min: Math.min(extractedIndicatorTimes[0]),
        // max: Math.max(extractedIndicatorTimes[0]),
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        // min: minYValue,
        // max: maxYValue,

        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
  };
};
