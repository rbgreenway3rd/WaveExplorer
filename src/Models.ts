export class Project {
  title: string;
  date: string;
  time: string;
  instrument: string;
  protocol: string;
  plate: Plate[];

  constructor(title: string, date: string, time: string, instrument: string, protocol: string) {
    this.title = title;
    this.date = date;
    this.time = time;
    this.instrument = instrument;
    this.protocol = protocol;
    this.plate = [];
  }
}

export class Plate {
  numberOfRows: number;
  numberOfColumns: number;
  assayPlateBarcode: string;
  addPlateBarcode: string;
  plateDimensions: number;
  experiments: Experiment[];

  constructor(
    numberOfRows: number,
    numberOfColumns: number,
    assayPlateBarcode: string,
    addPlateBarcode: string
  ) {
    this.numberOfRows = numberOfRows;
    this.numberOfColumns = numberOfColumns;
    this.assayPlateBarcode = assayPlateBarcode;
    this.addPlateBarcode = addPlateBarcode;
    this.plateDimensions = numberOfRows * numberOfColumns;
    this.experiments = [];
  }
}

export class Experiment {
  binning: string;
  numberOfRows: number;
  numberOfColumns: number;
  indicatorConfigurations: any; // Could be refined with a specific type if known
  operator: string;
  wells: Well[];

  constructor(
    binning: string,
    numberOfRows: number,
    numberOfColumns: number,
    indicatorConfigurations: any,
    operator: string
  ) {
    this.binning = binning;
    this.numberOfRows = numberOfRows;
    this.numberOfColumns = numberOfColumns;
    this.indicatorConfigurations = indicatorConfigurations;
    this.operator = operator;
    this.wells = [];
  }
}

export class Well {
  id: number;
  key: string;
  label: string;
  column: number;
  row: number;
  indicators: Indicator[];

  constructor(id: number, key: string, label: string, column: number, row: number) {
    this.id = id;
    this.key = key;
    this.label = label;
    this.column = column;
    this.row = row;
    this.indicators = [];
  }
}

export class Indicator {
  id: number;
  indicatorName: string;
  rawData: number[];
  filteredData: number[];
  time: number[];
  isDisplayed: boolean;
  analyses: [];

  constructor(
    id: number,
    indicatorName: string,
    rawData: number[],
    filteredData: number[],
    time: number[],
    isDisplayed: boolean,
    analyses: [],
  ) {
    this.id = id;
    this.indicatorName = indicatorName;
    this.rawData = rawData;
    this.filteredData = filteredData;
    this.time = time;
    this.isDisplayed = isDisplayed;
    this.analyses = analyses;
  }

  setDisplayed(value: boolean): void {
    this.isDisplayed = value;
  }
}

export interface IndicatorConfig {
  name: string;
  Excitation: string;
  Emission: string;
  Exposure: string;
  Gain: string;
}