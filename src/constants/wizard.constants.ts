import { ToolBarTool, ArtBoardTool } from "../models/toolbar.models";
import { WizardStepDefinition, WizardStep } from "../models/wizard.models";
import ArtBoardStep from "../wizard/artboard_step";
import { DEFINED_PANEL_TYPES } from "./artboard.contants";
import {
  DEFINED_CONFIGURATION_TOOLBAR_TOOLS,
  DEFINED_TOOLBAR_TOOLS,
} from "./toolbar.constants";

export const WIZARD_BASE: Partial<WizardStepDefinition> = {
  title: "Wizard",
  route: "/wizard",
  order: -1,
  complete: false,
};

export const UNTITLED_WIZARD_STEP: WizardStepDefinition = {
  title: "Untitled",
  route: "/untitled",
  order: 0,
  complete: false,
  component: ArtBoardStep,
  medium: {
    key: "untitled",
    label: "Untitled",
  },
  toolBarTools: Object.keys(DEFINED_TOOLBAR_TOOLS).map(
    (key) => key as ArtBoardTool
  ),
  configurationToolBarTools: Object.keys(
    DEFINED_CONFIGURATION_TOOLBAR_TOOLS
  ).map((key) => key as ToolBarTool),
};

export const DEFINED_WIZARD_STEPS: Partial<
  Record<WizardStep, WizardStepDefinition>
> = {
  title: {
    title: "Title Image",
    route: "/title",
    order: 0,
    complete: false,
    component: ArtBoardStep,
    medium: DEFINED_PANEL_TYPES.title,
    toolBarTools: Object.keys(DEFINED_TOOLBAR_TOOLS).map(
      (key) => key as ArtBoardTool
    ),
    configurationToolBarTools: Object.keys(
      DEFINED_CONFIGURATION_TOOLBAR_TOOLS
    ).map((key) => key as ToolBarTool),
  },
  scene: {
    title: "Scene 1",
    route: "/scene",
    order: 1,
    complete: false,
    component: ArtBoardStep,
    medium: DEFINED_PANEL_TYPES.scene,
    toolBarTools: Object.keys(DEFINED_TOOLBAR_TOOLS).map(
      (key) => key as ArtBoardTool
    ),
  },
};
