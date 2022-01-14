import React, { useEffect, useState } from "react";
import { useArtBoardContext } from "../artboard/artboard.context";
import ColorPickerPopUp from "../colorPicker/colorPicker";
import {
  DEFINED_CONFIGURATION_TOOLBAR_TOOLS,
  DEFINED_TOOLBAR_TOOLS,
} from "../constants/toolbar.constants";
import { useColor, useNumber } from "../hooks/useInput";
import { PanelConfiguration } from "../models/artboard.models";
import { ArtBoardTool, Tool } from "../models/toolbar.models";
import { PaintConfiguration } from "../models/toolTypes.models";
import { useWizardContext } from "../wizard/wizard.context";
import { useToolBarContext } from "./toolbar.context";

export const ConfigurationToolBar: React.FC = () => {
  const { state: toolBarState, dispatch: dispatchOnToolBar } =
    useToolBarContext();
  const { state: artBoardState, dispatch: dispatchOnArtBoard } =
    useArtBoardContext();

  const { state: wizardState } = useWizardContext();

  const [pickerStates, setPickerStates] = useState<Record<string, boolean>>({
    fill: false,
    stroke: false,
  });

  const {
    bind: bindStrokeWidth,
    value: strokeWidth,
    setValue: setStrokeWidth,
  } = useNumber(toolBarState.tool.paint?.strokeWidth, false, 99);

  const { value: strokeColor, setValue: setStrokeColor } = useColor(
    toolBarState.tool.paint?.strokeColor
  );

  const { value: fillColor, setValue: setFillColor } = useColor(
    toolBarState.tool.paint?.fillColor
  );

  useEffect(() => {
    dispatchOnToolBar({
      type: "configureTool",
      value: {
        strokeColor,
        fillColor,
        strokeWidth,
      } as PaintConfiguration,
    });
  }, [strokeColor, strokeWidth, fillColor, dispatchOnToolBar]);

  useEffect(() => {
    setStrokeWidth(toolBarState.tool.paint?.strokeWidth || 0);
  }, [toolBarState.tool, setStrokeWidth]);

  const handleToolChange = (e: any) => {
    if (
      Object.keys(DEFINED_CONFIGURATION_TOOLBAR_TOOLS).some(
        (key) => key === e.target.value
      )
    ) {
      let toolKey: ArtBoardTool = e.target.value as ArtBoardTool;
      switch (e.target.value) {
        case "undo":
          dispatchOnArtBoard({
            type: "removeLastShape",
            value: wizardState.currentStep.medium as PanelConfiguration,
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

  const renderTool = (tool: Tool) => {
    let iconBaseClasses =
      "uk-button uk-button-small uk-button-with-icon uk-flex";
    switch (tool.action) {
      case "iterative":
        iconBaseClasses += tool.key === toolBarState.tool.key ? " active" : "";
        break;
      default:
        iconBaseClasses += "";
        break;
    }
    switch (tool.key) {
      case "colorPicker":
        return (
          <>
            <div className="configuration-option-container">
              <label>
                <small>Fill</small>
                <ColorPickerPopUp
                  id="fillPicker"
                  swatchType="square"
                  color={fillColor}
                  show={pickerStates.fill}
                  onColorChange={(color: string) => {
                    setFillColor(color);
                  }}
                  onShow={(show: boolean) => {
                    setPickerStates({
                      fill: show,
                      stroke: !show,
                    });
                  }}
                ></ColorPickerPopUp>
              </label>
            </div>
            <div className="configuration-option-container">
              <label>
                <small>Stroke</small>
                <ColorPickerPopUp
                  id="strokePicker"
                  swatchType="stroke"
                  color={strokeColor}
                  show={pickerStates.stroke}
                  onColorChange={(color: string) => {
                    setStrokeColor(color);
                  }}
                  onShow={(show: boolean) => {
                    setPickerStates({
                      fill: !show,
                      stroke: show,
                    });
                  }}
                ></ColorPickerPopUp>
              </label>
            </div>
          </>
        );
      case "strokeWidth":
        return (
          <div className="configuration-option-container">
            <label>
              <small>Stroke Width</small>
              <div className="uk-fieldset">
                <label>
                  <input
                    className="paint-option-input uk-textarea uk-form-small"
                    type="number"
                    {...bindStrokeWidth}
                  ></input>
                </label>
              </div>
            </label>
          </div>
        );
      default:
        return (
          <div className="configuration-button-container">
            <button
              uk-tooltip={tool.label}
              title={tool.label}
              value={tool.key}
              className={iconBaseClasses}
              onClick={handleToolChange}
            >
              {tool.key}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d={tool.iconPath} />
              </svg>
            </button>
          </div>
        );
    }
  };

  return (
    <>
      <div className="configuration-option-bar uk-flex">
        {Object.values(DEFINED_CONFIGURATION_TOOLBAR_TOOLS).map((tool) => {
          return renderTool(tool);
        })}
      </div>
    </>
  );
};
