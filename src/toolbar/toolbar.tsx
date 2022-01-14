import React, { useCallback, useEffect, useState } from "react";
import { useArtBoardContext } from "../artboard/artboard.context";
import { DEFINED_TOOLBAR_TOOLS } from "../constants/toolbar.constants";
import useReactEnv from "../hooks/useReactEnv";
import { ArtBoardTool } from "../models/toolbar.models";
import { useWizardContext } from "../wizard/wizard.context";
import { useToolBarContext } from "./toolbar.context";

export const ArtboardToolBar: React.FC = () => {
  const { state: toolBarState, dispatch: dispatchOnToolBar } =
    useToolBarContext();
  const { state: artBoardState, dispatch: dispatchOnArtBoard } =
    useArtBoardContext();
  const { state: wizardState } = useWizardContext();
  const { usePaintOptions } = useReactEnv();
  const [hasPaintOptions] = useState<boolean>(usePaintOptions);
  // const [hasSave, setHasSave] = useState<boolean>(
  //   wizardState.currentStep.toolBarTools
  //     ? wizardState.currentStep.toolBarTools.indexOf("save") > -1
  //     : false
  // );

  // const updateState = useCallback(() => {
  //   setHasSave(
  //     wizardState.currentStep.toolBarTools
  //       ? wizardState.currentStep.toolBarTools.indexOf("save") > -1
  //       : false
  //   );
  // }, [wizardState.currentStep]);

  // useEffect(() => {
  //   updateState();
  // }, [wizardState, updateState]);

  const handleToolChange = (e: any) => {
    if (
      Object.keys(DEFINED_TOOLBAR_TOOLS).some((key) => key === e.target.value)
    ) {
      let toolKey: ArtBoardTool = e.target.value as ArtBoardTool;
      switch (e.target.value) {
        case "undo":
          dispatchOnArtBoard({
            type: "removeLastShape",
            value: wizardState.currentStep.medium,
          });
          break;
        case "nuke":
          dispatchOnArtBoard({
            type: "nukeAllShapesForPanelByMedium",
            value: artBoardState.mediumType,
          });
          break;
        default:
          dispatchOnToolBar({
            type: "setTool",
            value: DEFINED_TOOLBAR_TOOLS[toolKey],
          });
          break;
      }
    }
  };

  return (
    <div
      data-uk-width-1-1
      className={hasPaintOptions ? "uk-button-bar vertical" : "uk-button-bar"}
    >
      {Object.values(DEFINED_TOOLBAR_TOOLS)
        .filter((tool) => {
          if (
            wizardState.currentStep.toolBarTools !== undefined &&
            wizardState.currentStep.toolBarTools !== null
          ) {
            if (
              wizardState.currentStep.toolBarTools.indexOf(
                tool.key as ArtBoardTool
              ) > -1
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        })
        .map((tool) => {
          let iconBaseClasses = "uk-button uk-button-default uk-button-small";
          switch (tool.action) {
            case "iterative":
              iconBaseClasses +=
                tool.key === toolBarState.tool.key ? " active" : "";
              break;
            default:
              iconBaseClasses += "";
              break;
          }
          return (
            <button
              uk-tooltip={tool.label}
              title={tool.label}
              value={tool.key}
              className={iconBaseClasses}
              onClick={handleToolChange}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d={tool.iconPath} />
              </svg>
            </button>
          );
        })}
    </div>
  );
};
