import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../../Models";
import { createSelector } from "reselect";
import { RootState } from "../Store";

// Base selectors
const selectProjectState = (state: RootState) => state.project;
const selectSelectedGraphs = (state: RootState) => state.project.selectedGraphs;

// Memoized selector for graph data
export const selectGraphData = createSelector(
  [selectProjectState, selectSelectedGraphs],
  (projectState, selectedGraphs) => {
    const { project, timeArray } = projectState;

    if (!project || !timeArray || selectedGraphs.length === 0) return null;

    // Cache wells for faster lookup
    const wellsMap = new Map(
      project.plate[0]?.experiments[0]?.wells.map((well) => [well.id, well])
    );

    const datasets = selectedGraphs.map((wellId) => {
      const well = wellsMap.get(wellId);

      if (!well || well.indicators.length === 0) {
        return {
          label: `Well ${wellId}`,
          data: [],
          borderColor: "rgba(200, 200, 200, 1)",
          backgroundColor: "rgba(0, 0, 0, 0)",
          borderWidth: 1,
        };
      }

      const indicator = well.indicators[0];
      return {
        label: well.label,
        data: indicator.rawData,
        borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        }, 1)`,
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderWidth: 1,
      };
    });

    const timeKeys = Object.keys(timeArray);
    const labels = timeKeys.length > 0 ? timeArray[timeKeys[0]] : [];

    return {
      labels,
      datasets,
    };
  }
);

interface ProjectState {
  project: Project | null;
  fileType: string | null;
  dataExtracted: boolean;
  timeArray: Record<string, number[]> | null;
  allYValues: Record<string, number[]> | null;
  selectedGraphs: number[]; // Array of selected graph IDs
}

const initialState: ProjectState = {
  project: null,
  fileType: null,
  dataExtracted: false,
  timeArray: null,
  allYValues: null,
  selectedGraphs: [], // Initialize as an empty array
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject(state, action: PayloadAction<Project>) {
      state.project = action.payload;
      state.dataExtracted = true;
    },
    setFileType(state, action: PayloadAction<string | null>) {
      state.fileType = action.payload;
    },
    setTimeArray(state, action: PayloadAction<Record<string, number[]>>) {
      state.timeArray = action.payload;
    },
    setAllYValues(state, action: PayloadAction<Record<string, number[]>>) {
      state.allYValues = action.payload;
    },
    addSelectedGraph(state, action: PayloadAction<number>) {
      if (!state.selectedGraphs.includes(action.payload)) {
        state.selectedGraphs.push(action.payload); // Add graph ID if not already selected
      }
    },
    removeSelectedGraph(state, action: PayloadAction<number>) {
      state.selectedGraphs = state.selectedGraphs.filter(
        (id) => id !== action.payload
      ); // Remove graph ID
    },
    resetProject(state) {
      state.project = null;
      state.fileType = null;
      state.dataExtracted = false;
      state.timeArray = null;
      state.allYValues = null;
      state.selectedGraphs = []; // Reset selected graphs
    },
  },
});

export const {
  setProject,
  setFileType,
  setTimeArray,
  setAllYValues,
  addSelectedGraph,
  removeSelectedGraph,
  resetProject,
} = projectSlice.actions;

export default projectSlice.reducer;
