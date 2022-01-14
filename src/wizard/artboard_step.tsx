import React, { useEffect } from "react";
import { useLocation } from "react-router";
import ArtBoard from "../artboard/artboard";
import { useArtBoardContext } from "../artboard/artboard.context";
import { DEFINED_PANEL_TYPES } from "../constants/artboard.contants";
import { PanelConfiguration } from "../models/artboard.models";
import { useWizardContext } from "./wizard.context";

const ArtBoardStep = () => {
  const location = useLocation();
  const { state: wizardState, dispatch: dispatchToWizard } = useWizardContext();
  const {
    state: artBoardState,
    dispatch: dispatchToArtboard,
    payload,
  } = useArtBoardContext();

  useEffect(() => {
    dispatchToWizard({
      type: "setPayload",
      value: artBoardState.asPayload,
    });
    dispatchToArtboard({
      type: "setMediumType",
      value: wizardState.currentStep.medium as PanelConfiguration,
    });
  }, [
    dispatchToWizard,
    artBoardState.asPayload,
    dispatchToArtboard,
    wizardState.currentStep,
  ]);

  useEffect(() => {
    if (
      "/" + location.pathname.split("/")[2] !==
      wizardState.currentStep.route
    ) {
    }
  }, [
    location,
    dispatchToArtboard,
    dispatchToWizard,
    payload,
    wizardState.currentStep,
  ]);

  return (
    <div className="ec-canvas">
      <ArtBoard
        medium={wizardState.currentStep.medium || DEFINED_PANEL_TYPES.title}
        isFinalized={wizardState.currentStep.complete}
      />
    </div>
  );
};

export default ArtBoardStep;
