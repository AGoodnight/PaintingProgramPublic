import { Stage } from "konva/lib/Stage";
import { CursorWithinElementRelationship } from "../cursor.context";
import { StepAPIPayload } from "./api.model";
import { ArtBoardTool } from "./toolbar.models";

export type Point = [number, number];
export type Position = { x: number; y: number };
export interface Shape extends Record<string, unknown> {
  tool: ArtBoardTool;
  fillColor: string;
  strokeColor: string;
  pointsAsFlatArray: number[];
  points: Point[];
  type: PanelConfiguration;
  strokeWidth: number;
  tension?: number;
  closed: boolean;
}
export type PanelConfiguration = {
  label: string;
  key: string;
};

export type PanelKey = "title" | "scene" | string;

export type ArtBoardPayload = StepAPIPayload;

export type PanelAndShapes = {
  shapes: Shape[];
  medium: PanelConfiguration;
};

export type ArtBoardValueType =
  | Point
  | Shape
  | Shape[]
  | ArtBoardTool
  | PanelKey
  | PanelAndShapes
  | ArtBoardPayload
  | Stage
  | boolean
  | PanelConfiguration
  | CursorWithinElementRelationship;
export type ArtBoardAction = {
  type: ArtBoardActionTypes;
  value?: ArtBoardValueType;
};

export type ArtBoardActionTypes =
  | "setFinalizedShapes"
  | "setId"
  | "setShapes"
  | "startCurrentShape"
  | "addToCurrentShape"
  | "endCurrentShape"
  | "startRemoveFromShapes"
  | "continueRemoveFromShapes"
  | "endRemoveFromShapes"
  | "setMediumType"
  | "setTool"
  | "toggleDrawing"
  | "endDrawing"
  | "startDrawing"
  | "removeLastShape"
  | "addCurrentShape"
  | "setPayload"
  | "cancelLastChange"
  | "endCancelEvent"
  | "nukeAllShapes"
  | "finalizeShapesForPanelByMedium"
  | "finalizeAllShapes"
  | "nukeAllShapesForPanelByMedium"
  | "nukeEverything"
  | "stageRendered"
  | "cursorWithinArtboard";

export type ArtBoardMapLocation = {
  lat: number;
  long: number;
  zoom: number;
};

export type RectSize = {
  height: number;
  width: number;
};

export type ArtBoardState = {
  id: null | undefined | string;
  shapes: Shape[];
  finalizedShapes: Shape[];
  drawing: boolean;
  canceling: boolean;
  mediumType: PanelConfiguration;
  currentShape: Shape | null;
  renderedImage: Blob | null;
  staticMapAsBlobImage: Blob | null;
  mapLocation: ArtBoardMapLocation;
  asPayload: ArtBoardPayload;
  canvasSize: RectSize;
  cursorWithinArtboard: boolean;
  cursorLeftBoundsLTRB: boolean[];
  cursorLeftArtBoardAt: [number, number];
  cursorEnteredArtBoardAt: [number, number];
  currentArtBoard: Stage | null | undefined;
};
export type ArtBoardDispatch = (action: ArtBoardAction) => void;
export type ArtBoardRedux = {
  state: ArtBoardState;
  dispatch: ArtBoardDispatch;
  payload: ArtBoardPayload;
};
