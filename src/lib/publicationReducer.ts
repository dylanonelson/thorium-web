import { createSlice } from "@reduxjs/toolkit";

import { UnstableProgressionObject } from "@/components/StatefulReaderProgression";
import { TocItem } from "@/helpers/createTocTree";
import { Locator } from "@readium/shared";
import { UnstableTimeline } from "@/hooks/useTimeline";

export interface PublicationReducerState {
  runningHead?: string;
  isFXL: boolean;
  isRTL: boolean;
  progression: UnstableProgressionObject;
  positionsList: Locator[],
  atPublicationStart: boolean;
  atPublicationEnd: boolean;
  unstableTimeline?: UnstableTimeline;
}

const initialState: PublicationReducerState = {
  runningHead: undefined,
  isFXL: false,
  isRTL: false,
  progression: {},
  positionsList: [],
  atPublicationStart: false,
  atPublicationEnd: false,
  unstableTimeline: undefined
}

export const publicationSlice = createSlice({
  name: "publication",
  initialState,
  reducers: {
    setRunningHead: (state, action) => {
      state.runningHead = action.payload
    },
    setFXL: (state, action) => {
      state.isFXL = action.payload
    },
    setRTL: (state, action) => {
      state.isRTL = action.payload
    },
    setProgression: (state, action) => {
      state.progression = {...state.progression, ...action.payload }
    },
    setPositionsList: (state, action) => {
      state.positionsList = action.payload
    },
    setPublicationStart: (state, action) => {
      state.atPublicationStart = action.payload
    },
    setPublicationEnd: (state, action) => {
      state.atPublicationEnd = action.payload
    },
    setTimeline: (state, action) => {
      state.unstableTimeline = {
        ...action.payload,
        toc: action.payload.toc || { tree: undefined, currentEntry: undefined }
      };
    },
    setTocTree: (state, action) => {
      if (!state.unstableTimeline) {
        state.unstableTimeline = {
          toc: { tree: action.payload, currentEntry: undefined }
        };
      } else if (state.unstableTimeline.toc) {
        state.unstableTimeline.toc.tree = action.payload;
      } else {
        state.unstableTimeline.toc = { tree: action.payload, currentEntry: undefined };
      }
    },
    setTocEntry: (state, action) => {
      if (!state.unstableTimeline) {
        state.unstableTimeline = {
          toc: { tree: undefined, currentEntry: action.payload }
        };
      } else if (state.unstableTimeline.toc) {
        state.unstableTimeline.toc.currentEntry = action.payload;
      } else {
        state.unstableTimeline.toc = { tree: undefined, currentEntry: action.payload };
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const { 
  setRunningHead,
  setFXL,
  setRTL,
  setProgression,
  setPositionsList,
  setPublicationStart,
  setPublicationEnd,
  setTimeline,
  setTocTree, 
  setTocEntry,
} = publicationSlice.actions;

export default publicationSlice.reducer;