import {
  Project,
  Plate,
  Experiment,
  Well,
  Indicator,
  IndicatorConfig,
} from "../Models";

const extractProjectTitle = (content: string): string => {
  const lines = content.split("\n");
  const projectLine = lines.find((line) => line.includes("Project"));
  return projectLine && projectLine.split("\t").length > 1
    ? projectLine.split("\t")[1].trim()
    : "";
};

const extractProjectDate = (content: string): string => {
  const lines = content.split("\n");
  const dateLine = lines.find((line) => line.includes("Date"));
  return dateLine && dateLine.split("\t").length > 1
    ? dateLine.split("\t")[1].trim()
    : "";
};

const extractProjectTime = (content: string): string => {
  const lines = content.split("\n");
  const timeLine = lines.find((line) => line.includes("Time"));
  return timeLine && timeLine.split("\t").length > 1
    ? timeLine.split("\t")[1].trim()
    : "";
};

const extractInstrument = (content: string): string => {
  const lines = content.split("\n");
  const instrumentLine = lines.find((line) => line.includes("Instrument"));
  return instrumentLine && instrumentLine.split("\t").length > 1
    ? instrumentLine.split("\t")[1].trim()
    : "";
};

const extractProjectProtocol = (content: string): string => {
  const lines = content.split("\n");
  const protocolLine = lines.find((line) => line.includes("ProtocolName"));
  return protocolLine && protocolLine.split("\t").length > 1
    ? protocolLine.split("\t")[1].trim()
    : "";
};

const extractIndicatorConfigurations = (content: string): IndicatorConfig[] => {
  const lines = content.split("\n");
  return lines
    .filter((line) => line.includes("Indicator"))
    .map((line) => {
      const parts = line.split("\t");
      if (parts.length >= 9) {
        return {
          name: parts[1].trim(),
          Excitation: parts[3].trim(),
          Emission: parts[5].trim(),
          Exposure: parts[7].trim(),
          Gain: parts[9].trim(),
        };
      }
      return null;
    })
    .filter((config): config is IndicatorConfig => config !== null);
};

const extractOperator = (content: string): string[] => {
  const lines = content.split("\n");
  const startIndex = lines.findIndex((line) => line.includes("NumCols"));
  const endIndex = lines.findIndex((line) => line.includes("Project"));
  if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
    const operatorLine = lines[startIndex + 1];
    return operatorLine
      .split("\t")
      .slice(1)
      .map((part) => part.trim());
  }
  return [];
};

const extractAssayPlateBarcode = (content: string): string => {
  const lines = content.split("\n");
  const barcodeLine = lines.find((line) => line.includes("AssayPlateBarcode"));
  return barcodeLine && barcodeLine.split("\t").length > 1
    ? barcodeLine.split("\t")[1].trim()
    : "";
};

const extractAddPlateBarcode = (content: string): string => {
  const lines = content.split("\n");
  const barcodeLine = lines.find((line) => line.includes("AddPlateBarcode"));
  return barcodeLine && barcodeLine.split("\t").length > 1
    ? barcodeLine.split("\t")[1].trim()
    : "";
};

const extractBinning = (content: string): string => {
  const lines = content.split("\n");
  const binningLine = lines.find((line) => line.includes("Binning"));
  return binningLine && binningLine.split("\t").length > 1
    ? binningLine.split("\t")[1].trim()
    : "";
};

const extractNumberOfRows = (content: string): number => {
  const lines = content.split("\n");
  const numRowsLine = lines.find((line) => line.includes("NumRows"));
  return numRowsLine ? parseInt(numRowsLine.replace(/[^\d]/g, ""), 10) : 0;
};

const extractNumberOfColumns = (content: string): number => {
  const lines = content.split("\n");
  const numColsLine = lines.find((line) => line.includes("NumCols"));
  return numColsLine ? parseInt(numColsLine.replace(/[^\d]/g, ""), 10) : 0;
};

interface IndicatorInfo {
  id: number;
  indicatorName: string;
  startIndex: number;
  endIndex: number;
}

const findLinesWith = (lines: string[], matchString: string): number[] => {
  return lines
    .map((line, index) => (line.includes(matchString) ? index : -1))
    .filter((index) => index !== -1);
};

const getItem = (line: string, ndx: number): string => {
  const tokens = line.split("\t");
  return tokens[ndx] || "";
};

const getIndicators = (content: string): IndicatorInfo[] => {
  const lines = content.split("\n");
  const startNdxs = findLinesWith(lines, "<INDICATOR_DATA");
  const endNdxs = findLinesWith(lines, "</INDICATOR_DATA>");
  return startNdxs.map((startIndex, i) => ({
    id: i,
    indicatorName: getItem(lines[startIndex], 1),
    startIndex,
    endIndex: endNdxs[i],
  }));
};

const extractLines = (
  content: string,
  indicators: IndicatorInfo[]
): Record<string, string[]> => {
  const lines = content.split("\n");
  const extractedLinesByIndicator: Record<string, string[]> = {};
  indicators.forEach(({ indicatorName, startIndex, endIndex }) => {
    extractedLinesByIndicator[indicatorName] = lines.slice(
      startIndex + 2,
      endIndex
    );
  });
  return extractedLinesByIndicator;
};

const extractIndicatorTimes = (
  extractedLinesByIndicator: Record<string, string[]>,
  extractedRows: number,
  extractedColumns: number
): {
  indicatorTimes: Record<string, number[]>;
  analysisData: Record<string, number[]>;
} => {
  const indicatorTimes: Record<string, number[]> = {};
  const analysisData: Record<string, number[]> = {};

  for (const indicator in extractedLinesByIndicator) {
    const extractedLines = extractedLinesByIndicator[indicator];
    const times: number[] = [];
    const dataPoints: number[] = [];

    extractedLines.forEach((line) => {
      const lineElements = line.split("\t");
      const time = parseFloat(lineElements[0].replace("\r", ""));
      times.push(time);

      for (let j = 1; j < lineElements.length; j++) {
        const dataPoint = parseFloat(lineElements[j].replace("\r", ""));
        if (!isNaN(dataPoint)) {
          dataPoints.push(dataPoint);
        }
      }
    });

    indicatorTimes[indicator] = times;
    analysisData[indicator] = dataPoints;
  }

  return { indicatorTimes, analysisData };
};
export async function extractAllData(content: string): Promise<{
  project: Project;
  timeArray: Record<string, number[]>;
  allYValues: Record<string, number[]>;
}> {
  // Extract metadata
  const extractedRows = extractNumberOfRows(content);
  const extractedColumns = extractNumberOfColumns(content);
  const extractedProjectTitle = extractProjectTitle(content);
  const extractedProjectDate = extractProjectDate(content);
  const extractedProjectTime = extractProjectTime(content);
  const extractedProjectInstrument = extractInstrument(content);
  const extractedProjectProtocol = extractProjectProtocol(content);
  const extractedAssayPlateBarcode = extractAssayPlateBarcode(content);
  const extractedAddPlateBarcode = extractAddPlateBarcode(content);
  const extractedBinning = extractBinning(content);
  const extractedIndicatorConfigurations =
    extractIndicatorConfigurations(content);
  const extractedOperator = extractOperator(content);

  // Extract indicator data
  const extractedIndicators = getIndicators(content);
  const extractedLines = extractLines(content, extractedIndicators);
  const { indicatorTimes, analysisData } = extractIndicatorTimes(
    extractedLines,
    extractedRows,
    extractedColumns
  );

  //   console.log(indicatorTimes)

  // Create Project instance
  const project = new Project(
    extractedProjectTitle,
    extractedProjectDate,
    extractedProjectTime,
    extractedProjectInstrument,
    extractedProjectProtocol
  );

  // Create Plate instance
  const plate = new Plate(
    extractedRows,
    extractedColumns,
    extractedAssayPlateBarcode,
    extractedAddPlateBarcode
  );

  // Create Experiment instance
  const experiment = new Experiment(
    extractedBinning,
    extractedRows,
    extractedColumns,
    extractedIndicatorConfigurations,
    extractedOperator.join(", ")
  );

  // Create Well instances
  const wells: Well[] = [];
  for (let row = 0; row < extractedRows; row++) {
    for (let col = 0; col < extractedColumns; col++) {
      const wellId = row * extractedColumns + col; // Unique integer ID
      const wellKey = `${row}-${col}`; // Keep as key if needed
      const wellLabel = `${String.fromCharCode(65 + row)}${col + 1}`; // e.g., A1, B2
      const well = new Well(wellId, wellKey, wellLabel, col, row);
      wells.push(well);
    }
  }

  // Create Indicator instances and assign to wells
  let indicatorId = 0;
  wells.forEach((well, wellIndex) => {
    extractedIndicators.forEach((indicatorInfo) => {
      const indicatorName = indicatorInfo.indicatorName;
      const times = indicatorTimes[indicatorName];
      const dataPoints = analysisData[indicatorName];
      const wellCount = extractedRows * extractedColumns;
      const pointsPerWell = dataPoints.length / wellCount;
      const start = wellIndex * pointsPerWell;
      const end = start + pointsPerWell;
      const wellData = dataPoints.slice(start, end);
      const indicator = new Indicator(
        indicatorId++,
        indicatorName,
        wellData,
        [...wellData],
        times,
        false,
        []
      );
      well.indicators.push(indicator);
    });
  });

  // Assemble the hierarchy
  experiment.wells = wells;
  plate.experiments.push(experiment);
  project.plate.push(plate);

  return { project, timeArray: indicatorTimes, allYValues: analysisData };
}
