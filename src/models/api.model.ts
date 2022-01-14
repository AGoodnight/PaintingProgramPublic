import { Point } from "./artboard.models";
import { ArtBoardTool } from "./toolbar.models";

export type APIShape = {
  tool: ArtBoardTool;
  points: Point[];
};

export type StepAPIPayload = {
  id: null | undefined | string;
  // Required
  drawnImage: Blob; // Image drawn by user on top of map image
  areaType: string; // is it a tree, house, driveway?

  // Nice to Haves
  shapes: APIShape[]; // all points associated with the image, closed shapes
};
