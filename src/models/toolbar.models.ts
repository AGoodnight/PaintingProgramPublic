import { PaintConfiguration } from "./toolTypes.models";

export type ToolBarActionTypes = "setTool" | "configureTool";

export type ToolBarAction = {
  type: ToolBarActionTypes;
  value?: Tool | PaintConfiguration;
};

export type ToolBarState = {
  tool: Tool;
};
export type ToolBarDispatch = (action: ToolBarAction) => void;
export type ToolBarRedux = {
  state: ToolBarState;
  dispatch: ToolBarDispatch;
};

export type ToolActionType = "iterative" | "immediate";

export type Tool = {
  action: ToolActionType;
  key: ArtBoardTool | ToolBarTool;
  type?: ToolType;
  paint?: PaintConfiguration;
  iconPath?: string;
  label: string;
};

export const ArtBoardToolStrings = [
  "freehand",
  "paintbrush",
  "eraser",
  "polygon",
] as const;
export type ArtBoardTool = typeof ArtBoardToolStrings[number];

export const ToolTypeStrings = [
  "canvasTool",
  "artTool",
  "stateTool",
  "configurationTool",
] as const;
export type ToolType = typeof ToolTypeStrings[number];

export const ToolBarToolString = [
  "colorPicker",
  "strokeWidth",
  "undo",
  "nuke",
] as const;
export type ToolBarTool = typeof ToolBarToolString[number];
