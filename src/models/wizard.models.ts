import React from "react";
import { StepAPIPayload } from "./api.model";
import {
  ArtBoardPayload,
  PanelKey,
  PanelConfiguration,
} from "./artboard.models";
import { ToolBarTool, ArtBoardTool } from "./toolbar.models";

export interface WizardStepDefinition {
  keyStone?: boolean;
  title: string;
  route: string;
  order: number;
  medium?: PanelConfiguration;
  complete: boolean;
  component: React.FC;
  toolBarTools?: ArtBoardTool[];
  configurationToolBarTools?: ToolBarTool[];
}

export type WizardStep = PanelKey;
export type NewWizardStep = string;

export type WizardValueType = string | WizardStepDefinition | ArtBoardPayload;
export type WizardAction = {
  type: WizardActionTypes;
  value?: WizardValueType;
};

export type WizardActionTypes =
  | "setId"
  | "setSteps"
  | "setStep"
  | "nextStep"
  | "previousStep"
  | "setPayload"
  | "finalizeStep"
  | "resetStep"
  | "newWizardInstance"
  | "addWizardStep"
  | "removeWizardStep";

export type WizardState = {
  id: string | null | undefined;
  steps: WizardStepDefinition[];
  currentStep: WizardStepDefinition;
  currentStepIndex: number;
  payload: StepAPIPayload;
};
export type WizardDispatch = (action: WizardAction) => void;
export type WizardRedux = {
  state: WizardState;
  dispatch: WizardDispatch;
};
