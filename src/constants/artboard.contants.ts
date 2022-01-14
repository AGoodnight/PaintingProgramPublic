import {
  ArtBoardPayload,
  ArtBoardState,
  PanelKey,
} from "../models/artboard.models";
import { PanelConfiguration } from "../models/artboard.models";
import { PaintConfiguration } from "../models/toolTypes.models";

export const DEFINED_PANEL_TYPES: Record<PanelKey, PanelConfiguration> = {
  title: {
    label: "Title",
    key: "title",
  },
  scene: {
    label: "Scene",
    key: "scene",
  },
};

export const DEFINED_ACTIVE_DRAWING_CONFIG: PaintConfiguration = {
  strokeWidth: 1,
  strokeColor: "#0033ee",
  fillColor: "#fff",
  tension: 0.5,
  closed: false,
};

export const ART_BOARD_INITIAL_CONTEXT: ArtBoardState = {
  id: undefined,
  shapes: [],
  finalizedShapes: [],
  currentShape: null,
  drawing: false,
  mediumType: DEFINED_PANEL_TYPES.title,
  canceling: false,
  renderedImage: null,
  staticMapAsBlobImage: null,
  mapLocation: {
    lat: 0,
    long: 0,
    zoom: 0,
  },
  canvasSize: { width: 600, height: 400 },
  asPayload: {} as ArtBoardPayload,
  cursorWithinArtboard: false,
  cursorLeftBoundsLTRB: [false, false, false, false],
  currentArtBoard: null,
  cursorLeftArtBoardAt: [0, 0],
  cursorEnteredArtBoardAt: [0, 0],
};
