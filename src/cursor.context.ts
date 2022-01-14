import { createContext } from "react";

export type CursorContextType = {
  x: number;
  y: number;
};

export type CursorWithinElementRelationship = {
  isWithin: boolean;
  leftBoundsLTRB: boolean[];
  lastX: number;
  lastY: number;
};

export const CursorContext = createContext<CursorContextType>({
  x: 0,
  y: 0,
} as CursorContextType);

export const CursorProvider = CursorContext.Provider;
