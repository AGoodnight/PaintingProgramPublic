import React, { useCallback, useEffect, useRef } from "react";
import { useArtBoardContext } from "../artboard/artboard.context";
import { DEFINED_PANEL_TYPES } from "../constants/artboard.contants";
import { DEFINED_TOOLBAR_TOOLS } from "../constants/toolbar.constants";
import useApi from "../hooks/useApi";
import { APIShape } from "../models/api.model";
import { PanelKey, PanelConfiguration, Shape } from "../models/artboard.models";
import { useWizardContext } from "../wizard/wizard.context";

const ArtBoardResolver: React.FC = ({ children }) => {
  const cache = useRef<unknown | null>(null);
  const { dispatch: dispatchOnArtboard } = useArtBoardContext();
  const { state: wizardState } = useWizardContext();
  const { getSavedStep } = useApi();

  const setShapesContext = useCallback(
    (shapes: Shape[], medium: PanelConfiguration) => {
      console.log(medium, shapes);
      dispatchOnArtboard({
        type: "setFinalizedShapes",
        value: {
          medium,
          shapes,
        },
      });
    },
    [dispatchOnArtboard]
  );

  const fetch = useCallback(() => {
    if (!cache.current) {
      if (wizardState.currentStep.complete && wizardState.id) {
        const medium =
          wizardState.currentStep.medium || DEFINED_PANEL_TYPES.title;
        const stepFromApi = getSavedStep(
          wizardState.id,
          wizardState.currentStep.medium?.key as PanelKey
        );
        cache.current = stepFromApi;
        if (stepFromApi.shapes) {
          let ApiShapesAsShapes: Shape[] = [] as Shape[];
          if (stepFromApi.areaType) {
            const areaType: string = stepFromApi.areaType as string;
            ApiShapesAsShapes = stepFromApi.shapes
              .filter((shape) => DEFINED_TOOLBAR_TOOLS[shape.tool].paint)
              .map((shape: APIShape): Shape => {
                const _fill =
                  DEFINED_TOOLBAR_TOOLS[shape.tool].paint?.fillColor ??
                  "555555";
                const _stroke =
                  DEFINED_TOOLBAR_TOOLS[shape.tool].paint?.strokeColor ??
                  "555555";
                return {
                  pointsAsFlatArray: shape.points.flat(),
                  points: shape.points,
                  tool: shape.tool,
                  fillColor: _fill,
                  strokeColor: _stroke,
                  strokeWidth:
                    DEFINED_TOOLBAR_TOOLS[shape.tool].paint?.strokeWidth || 0,
                  type: {
                    key: areaType,
                    label: "null",
                  },
                  closed:
                    DEFINED_TOOLBAR_TOOLS[shape.tool].paint?.closed || false,
                };
              });
            setShapesContext(ApiShapesAsShapes, medium);
          }
        }
      }
    }
  }, [wizardState.currentStep, wizardState.id, setShapesContext, getSavedStep]);

  useEffect(() => {
    fetch();
  }, []);

  return cache ? <div>{children}</div> : <></>;
};

export default ArtBoardResolver;
