import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Project } from "../../Models";

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
