import React from "react";
import {
  DEFINED_CONFIGURATION_TOOLBAR_TOOLS,
  DEFINED_TOOLBAR_TOOLS,
} from "../constants/toolbar.constants";
import { DEFINED_WIZARD_STEPS } from "../constants/wizard.constants";
import { ToolBarTool, ArtBoardTool } from "../models/toolbar.models";
import { WizardState, WizardStepDefinition } from "../models/wizard.models";
import ArtBoardStep from "../wizard/artboard_step";

const useNewWizardSteps = () => {
  const useNew = (wizardState: WizardState): boolean => {
    return wizardState.steps.length > Object.keys(DEFINED_WIZARD_STEPS).length;
  };

  const createNewStep = (
    config: {
      title: string;
      route: string;
      mediumKey?: string;
      component?: React.FC;
      toolBarTools?: ArtBoardTool[];
      configurationToolBarTools?: ToolBarTool[];
    },
    wizardState: WizardState
  ): WizardStepDefinition => {
    return {
      title: config.title,
      route: config.route,
      order: wizardState.steps.length,
      complete: false,
      component: config.component ?? ArtBoardStep,
      medium: {
        label: config.title,
        key: config.mediumKey || "scene" + Math.random() * 1000000000,
      },
      toolBarTools:
        config.toolBarTools ??
        Object.keys(DEFINED_TOOLBAR_TOOLS).map((key) => key as ArtBoardTool),
      configurationToolBarTools:
        config.configurationToolBarTools ??
        Object.keys(DEFINED_CONFIGURATION_TOOLBAR_TOOLS).map(
          (key) => key as ToolBarTool
        ),
    };
  };

  return {
    useNew,
    createNewStep,
  };
};
export default useNewWizardSteps;
